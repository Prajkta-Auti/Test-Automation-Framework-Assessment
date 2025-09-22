// utils/dataFactory.js
import { faker } from '@faker-js/faker';

const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/;

export function createUserData(overrides = {}) {
  // Always generate first + last separately
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;

  // Validate with regex (defensive guard)
  if (!namePattern.test(fullName)) {
     fullName = "Akash Roy";
  }

  return {
    name: fullName,
    email: faker.internet.email().toLowerCase(),
    accountType: 'Basic',
    ...overrides,
  };
}

export function invalidUserPayload(type) {
  switch (type) {
    case 'numbersInName':
      return createUserData({ name: 'Priya123 James' });
    case 'singleWordName':
      return createUserData({ name: 'Priya' });
    case 'invalidEmail':
      return createUserData({ email: 'priyaa' });
    default:
      throw new Error(`Unknown invalid type: ${type}`);
  }
}

export function createTransactionData(userId, overrides = {}) {
  return {
    userId,
    amount: Math.round(parseFloat(faker.finance.amount(10, 1000, 2))), // random amount between 10–1000
    type: 'credit',
    recipientId: faker.string.alphanumeric(8),
    
    ...overrides,
  };
}
