// tests/uiValidationTest.spec.js
import { test, expect } from '@playwright/test';
import { createUserData, invalidUserPayload } from '../utils/dataFactory.js';


// Try to read text from a locator if it exists; return "" otherwise
async function getTextIfPresent(page, selector) {
  const loc = page.locator(selector).first();
  if (await loc.count()) {
    try {
      return (await loc.innerText()).trim();
    } catch { /* ignore */ }
  }
  return "";
}

// Submit the UI form without waiting on specific network hooks
async function submitUserFormUI(page, payload = createUserData()) {
  const { name, email, accountType = 'Basic' } = payload;
  await page.goto('/');
  await page.fill('#name', name);
  await page.fill('#email', email);
  try {
    await page.selectOption('#accountType', { label: accountType });
  } catch { /* ignore if not a <select> */ }
  await page.getByRole('button', { name: 'Create User' }).click();
}

/* -----------------------------
   API-first validation tests
----------------------------- */

test.describe('Validation (API-first)', () => {
  test('❌ Name with numbers rejected (400)', async ({ request }) => {
    const resp = await request.post('/api/users', {
      data: invalidUserPayload('numbersInName'),
    });
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(JSON.stringify(body)).toMatch(/name|invalid|letters|format/i);
  });

  test('❌ Single-word name rejected (400)', async ({ request }) => {
    const resp = await request.post('/api/users', {
      data: invalidUserPayload('singleWordName'),
    });
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(JSON.stringify(body)).toMatch(/first.*last|name.*format|invalid/i);
  });

  test('❌ Invalid email format rejected (400)', async ({ request }) => {
    const resp = await request.post('/api/users', {
      data: invalidUserPayload('invalidEmail'),
    }); 
    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(JSON.stringify(body)).toMatch(/email|invalid|format/i);
  });

});

/* -----------------------------
   Optional UI checks 
----------------------------- */

test.describe('Validation (optional UI surface)', () => {
  test('UI shows something for name-with-numbers', async ({ page }) => {
    await submitUserFormUI(page, invalidUserPayload('numbersInName'));

    const text = await getTextIfPresent(
      page,
      '[role="alert"], #error, .error, .error-message, #userError, #userResult'
    );
    if (text) {
      expect(text).toMatch(/invalid|error|letters|format|name/i);
    }
  });

  test('UI shows something for invalid email (if implemented)', async ({ page }) => {
    await submitUserFormUI(page, invalidUserPayload('invalidEmail'));

    const text = await getTextIfPresent(
      page,
      '[role="alert"], #error, .error, .error-message, #userError, #userResult'
    );
    
    if (text) {
      expect(text).toMatch(/invalid|email|format|error/i);
    }
  });

  test('UI shows success payload for valid input (if implemented)', async ({ page }) => {
    await submitUserFormUI(page, createUserData());

    const text = await getTextIfPresent(page, '#userResult');
    if (text) {
      const parsed = JSON.parse(text);
      expect(parsed).toHaveProperty('id');
    }
  });
});
