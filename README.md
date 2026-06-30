# 🏋️ AB Fitness Gym

> India's #1 premium gym franchise web app — built with Next.js 15, Prisma, NextAuth & Razorpay

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🎨 **Animated Canvas Hero** — floating gym equipment silhouettes, particle web, breathing glow
- 🔐 **Auth** — Register / Login with NextAuth v4 + bcrypt
- 💳 **Payments** — Razorpay integration with built-in **sandbox simulator** (no real keys needed)
- 🃏 **Virtual Gym Card** — Digital membership card with QR pattern
- 📍 **25+ Locations** — Searchable gym locator across India
- 🏃 **Exercise Library** — 21 exercises with AI-generated stickman position guides
- 💪 **Workout Plans** — 8 expert-curated programs with full breakdowns
- 📊 **Progress Tracker** — Body metrics with Recharts line charts
- 🎯 **Fitness Goals** — CRUD goals with SVG progress rings
- 📝 **Workout Logger** — Log sets/reps/weight with chart history

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/imaman007/ab-fitness-gym.git
cd ab-fitness-gym

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up the database
npx prisma db push
npx tsx prisma/seed.ts

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path — `file:./prisma/dev.db` |
| `NEXTAUTH_URL` | Your app URL — `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random 32+ char string |
| `RAZORPAY_KEY_ID` | From Razorpay dashboard (optional — sandbox works without) |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard (optional) |

> **Sandbox mode** — If no Razorpay keys are set, a built-in payment simulator activates automatically.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Database | SQLite via Prisma 6 (Rust engine) |
| Auth | NextAuth v4 |
| Payments | Razorpay + Sandbox Simulator |
| Charts | Recharts |
| Icons | lucide-react 0.475.0 |
| Styling | Vanilla CSS (Electric Violet + Neon Cyan dark theme) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/         # Login & Register pages
│   ├── api/            # API routes (auth, payments, goals, logs)
│   ├── dashboard/      # Member dashboard pages
│   ├── exercises/      # Exercise library
│   ├── locations/      # Gym locator
│   ├── tips/           # Fitness FAQ
│   └── workouts/       # Workout plans
├── components/         # Shared components (Navbar, Hero, Footer...)
└── lib/                # Prisma, Auth, Razorpay helpers

prisma/
├── schema.prisma       # 12-model database schema
└── seed.ts             # Seed: 3 plans, 21 exercises, 8 workouts, 25 locations

public/
└── exercises/          # AI-generated stickman position guide images
```

---

## 🔒 Security

- Secrets in `.env` / `.env.local` are **gitignored** — never committed
- See [SECURITY.md](./SECURITY.md) for vulnerability reporting
- Passwords hashed with **bcrypt**
- Routes protected by **NextAuth middleware**

---

## 📜 License

MIT © 2024 AB Fitness
