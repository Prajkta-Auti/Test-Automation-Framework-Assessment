import { test, expect } from '@playwright/test';
import { createUserData, createTransactionData } from '../utils/dataFactory.js';

test.describe.serial('UI Tests - Mock Fintech App', () => {
  let userId;
  let txPayload;

  test('User Registration Flow', async ({ page }) => {
    const userPayload = createUserData(); // name now "First Last"

    await page.goto('/');

    await page.fill('#name', userPayload.name);
    await page.fill('#email', userPayload.email);

    // Account Type is now a dropdown with options 'basic' and 'premium'
    await page.selectOption('#accountType', userPayload.accountType);
    await page.getByRole('button', { name: 'Create User' }).click();
    await page.waitForSelector('#userResult', { timeout: 5000 });
    const userResult = await page.locator('#userResult').innerText();
    if (!userResult) throw new Error('User creation failed.');
    userId = JSON.parse(userResult).id;
    expect(userId).toBeTruthy();
  });

  test('Transaction Creation Flow', async ({ page }) => {
    if (!userId) throw new Error('User not created, cannot proceed.');
    txPayload = createTransactionData(userId);
     
    await page.goto('/');

    await page.fill('#amount', String(txPayload.amount));
    await page.fill('#userId', txPayload.userId);
    await page.fill('#type', txPayload.type);
    await page.fill('#recipientId', txPayload.recipientId);
    await page.getByRole('button', { name: 'Create Transaction' }).click();
    await page.waitForSelector('#txResult', { timeout: 5000 });
    const txResult = await page.locator('#txResult').innerText();
    if (!txResult) throw new Error('Transaction creation failed.');
    expect(txResult).toContain(String(txPayload.amount));
  });
});
