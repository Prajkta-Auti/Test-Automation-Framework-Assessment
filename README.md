# Mock Fintech App – Automation Framework

This project is my take-home assignment.  
It shows how I built an automation framework for a simple fintech-style app.  
The app itself is a small Express server with user and transaction APIs, plus a basic UI.

---

## What’s included

- **Backend (Express)**  
  - Create user  
  - Get user by ID  
  - Create transaction  
  - Get transactions for a user  

- **Automation with Playwright**  
  - API tests → check user and transaction endpoints, including error cases  
  - UI tests → cover user registration, transaction creation, and error messages  

- **Utilities**  
  - Data factory to generate fake users and transactions  
  - Helpers for API response logging and validation  
  - Reporting setup with Playwright (and optional Allure)  

---

## How to run

1. Clone the repo and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd demo_fintech_app
   npm install
Start the mock server:

node server.js


The app runs on http://localhost:3000
.

Run the tests:

Run everything:

npx playwright test --project=chromium


Run only API tests:

npx playwright test tests/api.spec.js


Run only UI tests:

npx playwright test tests/ui.spec.js

Reports

After tests finish, open the Playwright HTML report:

npx playwright show-report


You’ll see results, screenshots for UI failures, and attached API responses.

Allure reporting is also supported if you install allure-playwright.

Environment configuration

This project works fine without any .env file.
I included a .env.example to show how it could be configured for different environments:

BASE_URL=http://localhost:3000
PORT=3000
NODE_ENV=development


If you want to use it:

cp .env.example .env
