const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

// In-memory mock databases
let users = [];
let transactions = [];

/* =========================
   Validators & Constants
   ========================= */
const NAME_RE = /^[A-Z][a-z]+ [A-Z][a-z]+$/;          // "Firstname Lastname"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;    // practical email check
const ALLOWED_ACCOUNTS = new Set(["basic", "premium"]);
const ALLOWED_TX_TYPES = new Set(["credit", "debit"]);

function validateUserPayload(body) {
  const errors = [];

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const accountType = String(body.accountType ?? "").trim().toLowerCase();

  if (!name) errors.push("Missing name");
  else if (!NAME_RE.test(name)) {
    errors.push("Name must be 'Firstname Lastname' with capitalized words");
  }

  if (!email) errors.push("Missing email");
  else if (!EMAIL_RE.test(email)) {
    errors.push("Invalid email format");
  }

  if (!accountType) errors.push("Missing accountType");
  else if (!ALLOWED_ACCOUNTS.has(accountType)) {
    errors.push("accountType must be 'Basic' or 'Premium'");
  }

  return { errors, name, email, accountType };
}

function validateTransactionPayload(body) {
  const errors = [];

  const userId = String(body.userId ?? "").trim();
  let amount = Number(body.amount);
  const type = String(body.type ?? "").trim().toLowerCase();
  const recipientId = String(body.recipientId ?? "").trim();

  if (!userId) errors.push("Missing userId");
  if (!Number.isFinite(amount)) errors.push("amount must be a number");
  // Normalize amount to an integer (round off); adjust to your business rule if needed
  amount = Math.round(amount);
  if (amount <= 0) errors.push("amount must be > 0");

  if (!type) errors.push("Missing type");
  else if (!ALLOWED_TX_TYPES.has(type)) errors.push("type must be 'credit' or 'debit'");

  if (!recipientId) errors.push("Missing recipientId");

  return { errors, userId, amount, type, recipientId };
}

/* =========================
   Routes
   ========================= */

// Create User with validation
app.post("/api/users", (req, res) => {
  const { errors, name, email, accountType } = validateUserPayload(req.body);
  if (errors.length) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    accountType, // already normalized to lowercase
  };
  users.push(newUser);
  return res.status(201).json(newUser);
});

// Get User
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

// Create Transaction with validation
app.post("/api/transactions", (req, res) => {
  const { errors, userId, amount, type, recipientId } = validateTransactionPayload(req.body);
  if (errors.length) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const newTx = {
    id: String(transactions.length + 1),
    userId,
    amount,       // integer-rounded
    type,         // 'credit' | 'debit'
    recipientId,
  };
  transactions.push(newTx);
  return res.status(201).json(newTx);
});

// Get Transactions for a user
app.get("/api/transactions/:userId", (req, res) => {
  const txs = transactions.filter((t) => t.userId === req.params.userId);
  return res.json(txs);
});

// Serve UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock fintech app running at http://localhost:${PORT}`);
});
