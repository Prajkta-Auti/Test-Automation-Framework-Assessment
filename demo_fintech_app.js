// demo_fintech_app/server.js
// A mock fintech backend with minimal UI for testing

const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

// In-memory mock databases
let users = [];
let transactions = [];

// API Endpoints
// Create User
app.post("/api/users", (req, res) => {
  const { name, email, accountType } = req.body;
  if (!name || !email || !accountType) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    accountType,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Get User
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// Create Transaction
app.post("/api/transactions", (req, res) => {
  const { userId, amount, type, recipientId } = req.body;
  if (!userId || !amount || !type || !recipientId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const newTx = {
    id: String(transactions.length + 1),
    userId,
    amount,
    type,
    recipientId,
  };
  transactions.push(newTx);
  res.status(201).json(newTx);
});

// Get Transactions by User
app.get("/api/transactions/:userId", (req, res) => {
  const txs = transactions.filter((t) => t.userId === req.params.userId);
  res.json(txs);
});

// Minimal UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock fintech app running at http://localhost:${PORT}`);
});


// demo_fintech_app/index.html
// A minimal frontend for UI test automation

/*
<!DOCTYPE html>
<html>
<head>
  <title>Mock Fintech App</title>
</head>
<body>
  <h1>Mock Fintech App</h1>

  <h2>Create User</h2>
  <form id="userForm">
    <input type="text" id="name" placeholder="Name" required />
    <input type="email" id="email" placeholder="Email" required />
    <input type="text" id="accountType" placeholder="Account Type" required />
    <button type="submit">Create User</button>
  </form>
  <pre id="userResult"></pre>

  <h2>Create Transaction</h2>
  <form id="txForm">
    <input type="text" id="userId" placeholder="User ID" required />
    <input type="number" id="amount" placeholder="Amount" required />
    <input type="text" id="type" placeholder="Type (transfer)" required />
    <input type="text" id="recipientId" placeholder="Recipient ID" required />
    <button type="submit">Create Transaction</button>
  </form>
  <pre id="txResult"></pre>

  <script>
    document.getElementById("userForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          accountType: document.getElementById("accountType").value,
        }),
      });
      document.getElementById("userResult").textContent = JSON.stringify(await res.json(), null, 2);
    });

    document.getElementById("txForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: document.getElementById("userId").value,
          amount: parseFloat(document.getElementById("amount").value),
          type: document.getElementById("type").value,
          recipientId: document.getElementById("recipientId").value,
        }),
      });
      document.getElementById("txResult").textContent = JSON.stringify(await res.json(), null, 2);
    });
  </script>
</body>
</html>
*/
