// tests/api.spec.js
import { test, expect } from '@playwright/test';
import { createUserData, createTransactionData } from '../utils/dataFactory.js';
import { attachApiJson } from './helper/apiLog.js';

let createdUser;

// Attach the response body 
async function expectOk(resp, where, testInfo) {
  // Read status first
  const status = resp.status();
// Attach the body (pretty JSON if possible). This CONSUMES the body.
  const pretty = await attachApiJson(testInfo, `${where}-response`, resp);

  if (status < 200 || status >= 300) {
    throw new Error(`${where} failed: HTTP ${status} — see attachment "${where}-response.json"`);
  }
 // Try to parse JSON from the attached text so callers can use it
  try {
    return JSON.parse(pretty);
  } catch {
    return pretty; // non-JSON body
  }
}

test.describe.serial('API Tests - Mock Fintech App', () => {
  test.beforeAll(async ({ request }, testInfo) => {
    const userPayload = createUserData({ accountType: 'premium' });

    const resp = await request.post('/api/users', { data: userPayload });
    const body = await expectOk(resp, 'Create user', testInfo); // attached + parsed

    expect(resp.status()).toBe(201);
    expect(body).toMatchObject({
      id: expect.any(String),
      name: userPayload.name,
      email: userPayload.email,
      accountType: expect.stringMatching(/^(basic|premium)$/),
    });

    createdUser = body;
  });

  test('Create User with factory', async () => {
    expect(createdUser).toHaveProperty('id');
  });

  test('Create Transaction with factory', async ({ request }, testInfo) => {
    expect(createdUser).toBeDefined();

    const txPayload = createTransactionData(createdUser.id);
    const resp = await request.post('/api/transactions', { data: txPayload });
    const body = await expectOk(resp, 'Create transaction', testInfo); // attached + parsed

    expect(resp.status()).toBe(201);
    expect(body).toMatchObject({
      id: expect.any(String),
      userId: String(createdUser.id),
      type: expect.stringMatching(/^(credit|debit)$/),
    });
    expect(Number.isInteger(body.amount)).toBe(true);
    expect(body.amount).toBe(txPayload.amount);
  });

  test('GET /api/users/:id - fetch created user', async ({ request }, testInfo) => {
    expect(createdUser).toBeTruthy();

    const resp = await request.get(`/api/users/${createdUser.id}`);
    const body = await expectOk(resp, 'Get user by id', testInfo); // attached + parsed

    expect(resp.status()).toBe(200);
    expect(body.id).toBe(createdUser.id);
    expect(body.email).toBe(createdUser.email);
  });

  test('GET /api/transactions/:userId - list transactions', async ({ request }, testInfo) => {
    expect(createdUser).toBeTruthy();

    const resp = await request.get(`/api/transactions/${createdUser.id}`);
    const list = await expectOk(resp, 'List transactions', testInfo); // attached + parsed

    expect(resp.status()).toBe(200);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toMatchObject({
      userId: String(createdUser.id),
      type: expect.stringMatching(/^(credit|debit)$/),
    });
  });
});
