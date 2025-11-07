# 🚀 Next.js Project

This project is built using [Next.js](https://nextjs.org), bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🧑‍💻 Getting Started

### 1. Install Dependencies

Using **pnpm** (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

---

### 2. Run the Development Server

Start the local development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## ⚙️ Project Setup

### Environment Variables

Create a `.env` file in the root directory and set up the required environment variables for your app.

---

### ORM / Database Setup

Generate ORM schema or SQL migration files:

```bash
npx @better-auth/cli generate
```

Push your Prisma schema to the database:

```bash
pnpm dlx prisma db push
```

---

### 📧 Email Integration (Resend)

Install the **Resend** package for email services:

```bash
pnpm add resend
```
---

### Search
In your Next.js app, install our @upstash/redis package:
```bash
pnpm install @upstash/search
```

---

## 🗂️ Project Structure

* `app/page.tsx` — Main entry point for the homepage.
  You can start editing this file to see live updates.
* `app/` — Contains all application routes and UI components.
* `next.config.js` — Next.js configuration file.
* `.env` — Environment variables (not committed to version control).

---

## 🧩 Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [**Geist**](https://vercel.com/font), a modern and elegant font family by Vercel.

---

## 📘 Learn More

To learn more about Next.js, explore:

* 📚 [Next.js Documentation](https://nextjs.org/docs) — Learn about Next.js features and APIs.
* 🧠 [Learn Next.js](https://nextjs.org/learn) — Interactive Next.js tutorial.
* 💻 [Next.js GitHub Repository](https://github.com/vercel/next.js) — Contribute and give feedback.

---
