# SandeRicardo — Fullstack & AI Engineer Portfolio

A premium, high-performance web portfolio and custom CMS built with Next.js (App Router, Version 16), Tailwind CSS (v4), Firebase, and Cloudinary. Designed with a strict "Monochrome Elegance" design system—brutalist blueprint aesthetic, grayscale color palette, sharp 1px borders, and zero border-radius.

---

## Project Structure

The project follows Next.js App Router conventions, utilizing Next.js 16 Server Actions instead of traditional API endpoints for backend mutations:

```text
├── app/
│   ├── admin/
│   │   ├── (dashboard)/       # CMS layouts (dashboard, content, projects, images, messages)
│   │   └── login/             # Administrator login page
│   ├── actions/               # Next.js Server Actions (auth, contact, content, github-update, messages, projects, revalidate, upload)
│   ├── layout.tsx             # Main layout incorporating Geist, Inter, and JetBrains Mono fonts
│   ├── page.tsx               # Homepage router initializing all frontend sections
│   └── globals.css            # Base Tailwind v4 configuration and brutalist theme definitions
├── components/
│   ├── admin/                 # CMS Forms, tables, tab panels, and sidebar navigation
│   ├── layout/                # Global Header and Footer wrappers
│   ├── sections/              # Homepage sub-components (About, Skills, Heatmap, Projects, Contact)
│   └── ui/                    # Reusable brutalist buttons, inputs, textareas, and upload zones
├── lib/
│   ├── cloudinary.ts          # Server-side upload interface
│   ├── firebase/              # Firebase Client (client.ts) and Admin (admin.ts) configs
│   ├── db/                    # CRUD Firestore managers (content, projects, messages)
│   └── github/                # GitHub GraphQL API contributions tracker (fetch-contributions.ts)
├── references/                # Product guidelines, designs, and roadmaps
├── proxy.ts                   # Next.js 16 route security interceptor
└── package.json               # Node dependencies manifest
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict compile-time check)
- **Styling:** Tailwind CSS (v4) + HSL CSS tokens in `globals.css`
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication (Google OAuth & Email/Password)
- **Media Hosting:** Cloudinary SDK (Direct upload of Base64 asset streams)
- **Email Service:** Resend REST API (Direct server fetch)
- **Activity Log API:** GitHub GraphQL API (Queries public viewer activity logs)
- **Security:** Custom Proxy redirect architecture (`proxy.ts`) for routing safety in Next.js 16

---

## Getting Started

### 1. Prerequisites

Make sure you have Node.js (LTS version) and `npm` installed on your machine.

### 2. Installation

Install dependencies using `npm`:

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and configure the following environment variables:

```env
# Firebase Client (Non-sensitive, exposed to client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-only)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key_with_escaped_newlines"

# Cloudinary (Server-only)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Server-only)
RESEND_API_KEY=your_resend_api_key
EMAIL_ADMIN_TO=your_notification_recipient_email

# GitHub Integration (Server-only)
GITHUB_TOKEN=your_github_personal_access_token

# Security & Revalidation Tokens (Server-only)
ADMIN_EMAILS=admin@example.com
```

### 4. Running Locally

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Development Modules & Roadmap

The development of this project is structured into four completed modules:

1. **Module 1: Foundations & Infrastructure**
   - Base configuration (ESLint, TS Strict, directories).
   - Design System Integration ("Monochrome Elegance" tokens in Tailwind CSS v4).
   - Firebase & Admin SDK integration.
2. **Module 2: Public Portfolio Site (Frontend)**
   - Reusable UI Components & Navigation.
   - Hero Section & Terminal-Style Boot Sequence.
   - About & Experience Sections (Git log style timeline).
   - Technology Stack & Skills Matrix.
   - Monochrome GitHub contributions heatmap.
   - Dynamic ISR Projects grid & detailed pages.
   - Contact form interface.
3. **Module 3: Admin Panel & CMS**
   - Authentication and route protection custom proxy (`proxy.ts`).
   - General content editor (Hero, About, Stack, Contact, Site Meta).
   - Projects CRUD & metric grids.
   - Cloudinary image uploader.
   - Message inbox for contact submissions.
4. **Module 4: Backend Services & External Integrations**
   - Contact form Server Actions (Firestore write + Resend Email notification).
   - GitHub API GraphQL Sync Service (Firestore cached heatmap, 24h auto-refresh).
   - On-demand Next.js ISR cache revalidation hooks.

---

## Project Guidelines

Please review `/references/agent_guidelines.md` for specific development rules, including:
- No emojis in the user interface.
- Standardized SVG icons usage.
- Strict language rules: communication in **Spanish**, code and internal documentation in **English**.
