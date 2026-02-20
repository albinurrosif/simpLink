# 🚀 KumpuLink

KumpuLink is a high-performance, full-stack Link-in-Bio platform that allows users to create a personalized landing page for all their important links. Built with **Next.js**, **PostgreSQL**, and **TypeScript**, it offers a seamless experience for both profile owners and visitors.

## 🛠 The Evolution: From Firebase to PostgreSQL

Originally built using Firebase (Auth & Firestore), KumpuLink has undergone a major architectural refactor to a **Custom Fullstack Architecture**. This migration was driven by the need for better data relational control, advanced analytics, and professional-grade performance.

### Key Changes:

- **Database**: Migrated from NoSQL (Firestore) to Relational (PostgreSQL).
- **Authentication**: Replaced Firebase Auth with a custom JWT-based system using HTTP-only cookies for enhanced security.
- **Architecture**: Implemented a **Service-Repository Pattern** to decouple business logic from data access.

## ✨ Core Features

- **Dynamic Theme System**: Choose from 35+ themes (Cyberpunk, Retro, Dracula, etc.) powered by DaisyUI. Themes are applied instantly across the dashboard and public profile.
- **Real-time Analytics**: Built-in tracking system that records link clicks with metadata (IP Address & User Agent) while filtering out local/internal traffic.
- **SEO & Performance**: Optimized using Next.js Server Components for lightning-fast page loads and better search engine indexing.
- **Drag & Drop Reordering**: Intuitively organize links with an "Optimistic UI" approach for zero-latency feedback.
- **Responsive Profile**: A clean, mobile-first design that looks great on any device.

## 🏗 Project Structure

The project follows a modular structure for maintainability:

```text
src/
├── app/                  # Next.js App Router (Pages & API Routes)
├── components/           # Reusable UI Components (Navbar, Modals, etc.)
├── context/              # Frontend state management (Auth Context)
├── lib/
│   ├── modules/          # Business Logic (User, Link, Analytics modules)
│   │   ├── user/         # User repository & service logic
│   │   ├── link/         # Link management logic
│   │   └── analytics/    # View recording & reporting
│   └── shared/           # Shared utilities (DB Connection, Query Builder)
├── types/                # Strict TypeScript definitions
└── styles/               # Global CSS & Tailwind configuration
```

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Security**: JWT (JSON Web Tokens) & Jose
- **Icons**: Lucide React / Heroicons
- **Deployment**: [Vercel](https://vercel.com/)

## ⚙️ Local Development

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/yourusername/kumpulink.git](https://github.com/yourusername/kumpulink.git)
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   POSTGRES_URL=your_postgresql_connection_string
   JWT_SECRET=your_random_secure_string
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The system architecture relies on three core relational tables:

- users: Stores credentials, profile metadata, and theme preferences.

- links: Stores URL data, active status, and display order.

- link_views: Log table for analytics, tracking every unique click on a user's link.

---
## 👨‍💻 Author

**Albi Nur Rosif**
- [Portfolio](https://albinur.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/albinurrosif/)

---
_© 2026 PreApply._