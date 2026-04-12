# 🌟 Flourisense Cafe

![Flourisense Cafe Hero](https://via.placeholder.com/1200x600/8B4513/FFF?text=Flourisense+Cafe+%F0%9F%95%95) *Modern cafe ordering experience*

**Flourisense Cafe** is a sleek, modern web application for a neighborhood cafe specializing in artisan coffee ☕, teas 🍵, pastries 🥐, and sandwiches 🥪. Customers scan QR codes to browse menus, add to cart, login with phone OTP, and checkout seamlessly. Features realtime kitchen order displays with voice announcements for staff. Built with cutting-edge React ecosystem for zero-wait ordering.

## ✨ Features

| Feature | Description |
|---------|-------------|
| **QR Code Ordering** | Scan → Browse → Order (no app needed) |
| **Rich Menu** | Filterable categories (Coffee, Espresso, Tea, Pastries, Sandwiches) with popular/new tags |
| **Smart Cart** | Persistent cart drawer, quantity management |
| **Phone OTP Auth** | Quick login (name + phone), Supabase-backed |
| **Realtime Orders** | Kitchen display (`/orders-display`) - preparing/ready status, voice TTS announcements |
| **Admin Dashboard** | `/admin` - manage orders/users |
| **Responsive UI** | Mobile-first, glassmorphism design, dark mode |
| **Pages** | Home, Menu, About, Locations, Checkout, Contact |

## 🛠 Tech Stack

```
Frontend: React 18 (TS) + Vite + React Router
UI: shadcn/ui (Radix) + TailwindCSS + Framer Motion
State: Context API + TanStack Query
Backend: Supabase (Auth, Realtime DB)
Other: Lucide Icons, Sonner Toasts, Zod Validation
Testing: Vitest
```

## 🚀 Quick Start - Local Development

### Prerequisites
- [Node.js](https://nodejs.org) ≥18
- [Supabase](https://supabase.com) account (free tier)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd Flourisense Cafe
npm install
```

### 2. Supabase Setup
1. Create free project at [supabase.com](https://supabase.com).
2. Run migrations: `supabase db push` (or use provided `supabase/migrations/` SQL).
3. Copy **Project URL** and **anon public key** to `.env.local`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
4. Create `orders` table (if not auto): `id, order_number, customer_name, items, status, created_at`.

### 3. Run Dev Server
```bash
npm run dev
```
- Opens [http://localhost:3000](http://localhost:3000)
- Test: Browse menu → Add items → Login → Checkout → Check `/orders-display`

### 4. Other Scripts
```bash
npm run build     # Production build (dist/)
npm run preview   # Preview build
npm run lint      # ESLint
npm run test      # Vitest
```

## 📁 Project Structure
```
Flourisense Cafe/
├── public/          # Static assets (favicon, hero.jpg)
├── src/
│   ├── components/  # UI (Navbar, Hero, CartDrawer, shadcn/ui)
│   ├── context/     # AuthContext, CartContext
│   ├── pages/       # Routes (Index.tsx, MenuPage.tsx, AdminDashboard.tsx)
│   ├── data/        # menuData.ts
│   └── integrations/supabase/ # Client & types
├── supabase/        # Local Supabase config/migrations
├── package.json     # npm deps/scripts
├── vite.config.ts   # Vite + React plugin
└── tailwind.config.ts
```

## 🚀 Deployment

- **Vercel/Netlify**: Connect GitHub repo, add Supabase env vars.
- **Build**: `npm run build` → Deploy `dist/`.
- Custom domain supported.

## 🔮 Demo
- Live: [TBD - Deploy to Vercel](https://vercel.com/new)
- Screenshots: Add to `public/` (hero, menu, orders-display).

## 🤝 Contributing
1. Fork & PR.
2. Follow TODO.md, TODO-PAGES.md, TODO-ADMIN.md for pending tasks.
3. `npm run lint` before commit.

## 📄 License
MIT - Feel free to use/fork!

---

**Made with ☕ by [Your Name]. Questions? hello@flourisense.cafe**

