# MediStore — Online OTC Medicine Platform

> A full-stack, multi-role e-commerce platform for purchasing over-the-counter medicines. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## 🔗 Live Demo & Backend

| Resource | Link |
|---|---|
| 🌐 Live Site | [medistore-client](https://medistore-client-sand.vercel.app/) |
| 🔧 Backend Repository | [medistore-server](https://github.com/israk03/medistore-server) |

---


## ✨ Features

### 🛍️ Customer
- Browse medicines by category
- Search and filter products
- Add to cart and place orders
- Leave reviews and ratings
- View personal order history

### 🏪 Seller
- List and manage medicine inventory
- Upload medicine images
- Track incoming orders
- View sales dashboard

### 🛡️ Admin
- Manage all users (customers & sellers)
- Approve/reject seller listings
- Monitor platform-wide orders
- Category management

### 🔐 Authentication
- JWT-based authentication with access & refresh token flow
- Google OAuth login via `@react-oauth/google`
- Role-based access control (RBAC): `ADMIN`, `SELLER`, `CUSTOMER`
- Axios interceptor for auto-attaching tokens to requests

---

## 🧱 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui, Radix UI |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with JWT interceptor) |
| Animations | Framer Motion |
| Icons | Lucide React, React Icons |
| Notifications | Sonner |
| Auth | JWT + Google OAuth |
| Font | Geist (via `next/font`) |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (auth)/               # Login, Register pages
│   ├── (public)/             # Public-facing routes (home, medicines, etc.)
│   ├── @admin/               # Parallel route slot — Admin dashboard
│   ├── @seller/              # Parallel route slot — Seller dashboard
│   ├── @customer/            # Parallel route slot — Customer dashboard
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Homepage
│
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── shared/               # Navbar, Footer, etc.
│   └── [feature]/            # Feature-specific components
│
├── lib/
│   ├── axios.ts              # Axios instance with JWT interceptor
│   └── utils.ts              # cn() and shared utilities
│
├── types/                    # Shared TypeScript types/interfaces
└── hooks/                    # Custom React hooks
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn
- The [MediStore backend server](https://github.com/israk03/medistore-server) running locally

### 1. Clone the Repository

```bash
git clone https://github.com/israk03/medistore-client.git
cd medistore-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@medistore.com` | `admin123` |
| Seller | `seller@medistore.com` | `seller123` |
| Customer | `user@medistore.com` | `user123` |

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server with Turbopack
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## 🏗️ Architecture Highlights

### Parallel Route Slots for Role-Based Dashboards

Next.js 15 parallel routes (`@admin`, `@seller`, `@customer`) power the multi-role dashboard system, rendering the correct dashboard UI based on the authenticated user's role without full page navigation.

### JWT Interceptor with Axios

A centralized Axios instance handles token attachment and refresh logic automatically, so every protected API call is authenticated without manual token management in each component.

### Server-Side & Client-Side Rendering

- Public pages (medicine listings, homepage) use **SSR** for SEO and fast initial load.
- Dashboard pages use **CSR** with client components for real-time interaction.

---

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub.
2. Import the repository on Vercel.
3. Add environment variables in the Vercel dashboard.
4. Deploy.

---

## 🤝 Contributing

This is a personal portfolio project. Feedback and suggestions are welcome — feel free to open an issue.

---

## 👤 Author

**Israk**
- GitHub: [@israk03](https://github.com/israk03)
- 4th Year CSE Student | Full Stack Developer

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).