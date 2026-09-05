# IVA Solution

This repository contains the IVA automation extension and its license-management dashboard.

## Projects

### `iva-assistance`

The customer-facing Chrome Extension (Manifest V3) for the Indian Visa Application workflow. It includes authentication, applicant and application management, webfile uploads, and workflow assistance.

### `iva-license-manager`

The administrator dashboard for managing extension licenses. It uses Firebase Authentication and Cloud Firestore and is also built as a Vite application.

## Prerequisites

- Node.js and npm
- Google Chrome, for loading the extension
- Firebase CLI, for deploying Firebase rules and indexes

## Install dependencies

Install dependencies in each project:

```bash
cd iva-assistance
npm install

cd ../iva-license-manager
npm install
```

Configure Firebase credentials using each project's environment configuration before running the applications. Do not commit `.env` files or credentials.

## Development

Run the customer extension:

```bash
cd iva-assistance
npm run dev
```

Run the license manager:

```bash
cd iva-license-manager
npm run dev
```

## Build and checks

```bash
cd iva-assistance
npm run type-check
npm run build

cd ../iva-license-manager
npm run build
```

The production output is written to each project's `dist/` directory.

## Load the extension locally

1. Build `iva-assistance` with `npm run build`.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose `iva-assistance/dist`.

## Firebase deployment

Each project has its own Firebase configuration, rules, and indexes. From the relevant project directory:

```bash
npm install -g firebase-tools
firebase login
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore,storage
```

The license manager uses Firestore only. The customer extension also defines Firebase Storage rules and Cloud Functions configuration.

## Repository structure

```text
iva-assistance/       Customer Chrome extension
iva-license-manager/  License administration dashboard
```

...
