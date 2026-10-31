<div align="center">

# 🌸 AniTracker ⛩️

### *Your personal anime log, powered by sakura petals and questionable sleep schedules*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-8-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)
[![Shikimori](https://img.shields.io/badge/Shikimori-Powered-ff6b6b?style=for-the-badge)](https://shikimori.one)

*"A true otaku doesn't lose their progress — they track it."*

</div>

---

## ⚡ What is this?

You binged 40 shows this season and now you can't remember which episode of *that one isekai* you stopped on. **AniTracker** fixes that.

It's a full-stack watchlist for people who treat anime like a spreadsheet problem — because it is one. Search Shikimori, pull in real posters and episode counts, bump your episode counter after every late-night session, and watch your stats badge tick up like a dopamine slot machine.

## 🖼️ A Glimpse Into the Guild Hall

<div align="center">

| ☀️ Light — sakura skies | 🌙 Dark — torii nights |
|---|---|
| ![Light theme](docs/screenshots/light-theme.png) | ![Dark theme](docs/screenshots/dark-theme.png) |

</div>

## 🎴 Features

- 🔍 **Shikimori auto-search** — type a title, get real posters, episode counts, and status pulled straight from the source. No more hunting for cover art on sketchy sites.
- 🌓 **Day & night mode** — a hand-painted sky for both themes (sakura skies by day, moonlit mountains and a torii gate by night), because your eyes deserve aesthetics at 3am too.
- 📺 **Episode tracking** — one click to bump your progress. `AIRING`, `COMPLETED`, `UPCOMING` — your list, your rules.
- 📊 **Table & grid views** — spreadsheet-brain mode or poster-wall mode, your choice.
- 🔐 **Real auth** — bcrypt-hashed passwords, signed sessions, no funny business.
- 🔄 **Bulk sync** — mass-import your backlog from Shikimori instead of typing 200 titles by hand.
- 🔔 **Toast notifications** — satisfying little pop-ups for every save, update, and delete.

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions) |
| UI | React 19 · Tailwind CSS 4 · shadcn-style components · lucide-react |
| Forms | react-hook-form + zod |
| Database | PostgreSQL via Prisma ORM 8 |
| Auth | bcrypt + jose (signed sessions) |
| Data source | [Shikimori API](https://shikimori.one/api/doc) 🎌 |

## 🚀 Quest Start (Getting Started)

### 1. Summon the dependencies

```bash
pnpm install
```

### 2. Prepare your database scroll

Copy the env template and fill in your secrets:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
SESSION_SECRET="your-session-secret"
```

### 3. Open the gate

```bash
pnpm dev
```

Then head to [http://localhost:3000](http://localhost:3000) and begin your adventure. ⛩️

## 📜 Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Fires up the dev server |
| `pnpm build` | Forges a production build |
| `pnpm start` | Runs the forged build |
| `pnpm lint` | Summons ESLint to judge your code |
| `pnpm contract:emit` | Regenerates the Prisma contract from your DB schema |

## 🏯 Project Structure

```
src/
├── app/              # Routes — (auth), (protected), api
├── actions/          # Server actions (anime, auth, shikimori, table-settings)
├── components/       # UI components (and that sweet anime background)
├── lib/              # Session, DAL, toast, utils
├── prisma/           # DB contract & client
└── validation-schemas # zod schemas
```

## 🌙 A Note from the Background Art

Yes, the background actually changes between light and dark mode. Yes, there's a torii gate. No, you're not legally required to binge-watch anything while this app is open — but we won't judge if you do.

---

<div align="center">

**Made with ❤️, caffeine, and a slightly unhealthy anime backlog**

*ここにあなたのアニメリストがあります — track responsibly* 🍥

</div>
