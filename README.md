# RTR Platform — End-to-End Test Automation Suite

A production-grade, modular End-to-End (E2E) automation testing framework for the RTR web platform (`uatapp.rtr.money`) built with **Playwright** and **JavaScript** using the **Page Object Model (POM)** design pattern.

---

## 🚀 Key Engineering Highlights

- **Page Object Model (POM):** Decoupled UI element locators and page interactions from test assertions to ensure maintainability and eliminate flaky selectors.
- **Zero-Dependency Network Interception:** Utilizes Playwright's `page.route()` with regex pattern matching (`/\/api\/authentication\/.../`) to mock backend microservices, enabling deterministic testing of happy and edge-case paths without consuming live SMS OTP credits.
- **Stateful Mocking Engine:** Dynamically tracks request payloads across multi-stage flows (e.g., OTP dispatch -> OTP verification -> MPIN mismatch error recovery -> session generation).
- **Asynchronous Event Handling:** Built around native browser timing quirks, such as automatic form submission on the 10th phone digit (200ms debounce) and auto-verification on the 6th OTP digit.
- **Strict Mode Compliant Locators:** Engineered using accessible roles (`getByRole`), labels, and exact test IDs to prevent ambiguous locator violations across complex modal overlays.

---

## 📁 Repository Structure

```text
.
├── mocks/
│   └── auth.mock.json          # Mock API fixtures for OTP, MPIN, and onboarding responses
├── pages/
│   └── SigninPage.js           # Page Object class containing locators & reusable screen actions
├── specs/
│   └── 01-login.spec.js        # Comprehensive test scenarios for Authentication & Onboarding
├── .gitignore                  # Excludes node_modules, reports, and local environment secrets
├── package.json                # Project dependencies and script definitions
├── package-lock.json           # Locked dependency tree
├── playwright.config.js        # Global Playwright configuration (baseURL, timeouts, reporters)
└── README.md                   # Documentation and run instructions
```

---

## 🧪 Test Coverage Matrix (`01-login.spec.js`)

| Section | Test Scenario | Description |
| :--- | :--- | :--- |
| **1. Entry & State** | Splash Navigation | Verifies routing between *Sign In* and *Create Account* views. |
| | Session Guard | Validates immediate redirect away from `/signin` when already authenticated. |
| | Legal Links | Asserts presence and clickability of Terms of Service & Privacy Policy. |
| **2. Mobile & Boundaries** | Length Boundary | Asserts "Send OTP" remains disabled when input is under 10 digits. |
| | Input Sanitization | Verifies non-numeric characters are stripped from the input field. |
| | Terms Checkbox Guard | Ensures unchecking terms blocks submission even with a valid 10-digit number. |
| | 200ms Auto-Submit | Validates auto-dispatch and loading spinner transition on 10th digit. |
| **3. Divergence & Errors** | Unregistered Mobile | Asserts error toast `"Mobile number not registered"` for unknown users. |
| | Duplicate Signup | Asserts error toast `"Account already created..."` on registration duplicate. |
| **4. OTP Mechanics** | Countdown Timer | Verifies 60s countdown timer and ensures Resend button remains disabled. |
| | Keyboard Traversal | Tests auto-focus shifting to next box on input and previous box on backspace. |
| | Clipboard Paste | Simulates pasting a 6-digit string, filling all boxes, and auto-submitting. |
| **5. MPIN & Onboarding** | Wrong OTP Error | Validates inline validation error, input field reset, and focus shift. |
| | Existing User Recovery | Tests wrong MPIN error display followed by correct MPIN dashboard redirect. |
| | New User Setup | Tests 2-step MPIN creation (*Create* -> *Confirm*), mismatch error, and onboarding routing. |

---

## 🛠️ Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

---

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Anki-bot/RTR-UAT-Playwright-Testing.git](https://github.com/Anki-bot/RTR-UAT-Playwright-Testing.git)
   cd RTR-UAT-Playwright-Testing
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browser binaries (Chromium):**
   ```bash
   npx playwright install chromium
   ```

---

## 🚦 Running Tests

### Run all tests in headless mode:
```bash
npx playwright test
```

### Run tests in headed browser mode (visible UI):
```bash
npx playwright test --headed
```

### Run specifically on Chromium with a single worker:
```bash
npx playwright test --project=chromium --workers=1
```

### Run in debug mode (Playwright Inspector):
```bash
npx playwright test --debug
```

### Run a specific test spec:
```bash
npx playwright test specs/01-login.spec.js --headed
```

---

## 📊 Reports & Trace Viewer

After test execution, Playwright generates an interactive HTML report containing step-by-step logs, failure screenshots, videos, and network call logs.

### View the latest test report:
```bash
npx playwright show-report
```

### Inspect failed traces:
If a test fails with trace capture enabled (`on-first-retry`), open the trace artifact using:
```bash
npx playwright show-trace test-results/<folder-name>/trace.zip
```
