# The Architect — Fullstack & AI Engineer Portfolio

A premium, high-performance web portfolio and custom CMS built with Next.js (App Router), Tailwind CSS, Firebase, and Cloudinary. Designed with the strict "Monochrome Elegance" design system—brutalist aesthetic, greyscale color palette, sharp 1px borders, and zero border-radius.

## Project Structure

Following Next.js App Router conventions and clean architecture principles:

```text
├── app/
│   ├── (public)/          # Public routes (Landing, Project details)
│   │   ├── projects/[slug]/
│   │   └── page.tsx       # Landing page (anchored scroll)
│   ├── (admin)/           # Protected admin dashboard (CSR)
│   │   ├── login/
│   │   └── admin/         # Subroutes for projects, content, messages, images
│   ├── api/
│   │   ├── cron/github/   # Vercel Cron handler for GitHub contributions
│   │   ├── contact/       # Contact form server action/handler
│   │   └── revalidate/    # On-demand ISR cache revalidation
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # Atomic and reusable UI components
│   ├── sections/          # Landing page sections (Hero, About, Stack, etc.)
│   └── admin/             # Admin-specific interface components
├── lib/
│   ├── firebase/          # Firebase client and admin SDK initializations
│   ├── cloudinary/        # Cloudinary SDK wrappers and helpers
│   ├── email/             # Resend email templates and sender services
│   └── validations/       # Zod schemas for validation
├── types/                 # Global TypeScript types and interfaces
├── hooks/                 # Reusable custom React hooks
└── references/            # Project specifications and guidelines
```

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS (configured for Monochrome Elegance)
- **Database:** Firebase Firestore (Spark Plan)
- **Authentication:** Firebase Authentication (Google OAuth & Email/Password)
- **Media Hosting:** Cloudinary (Free tier)
- **Email Service:** Resend (or SMTP relay)
- **Package Manager:** `pnpm`

## Getting Started

### 1. Prerequisites

Make sure you have Node.js (LTS version) and `pnpm` installed on your machine.

### 2. Installation

Install dependencies using `pnpm`:

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and configure the following environment variables (refer to `references/Software_Requirements_Specification.md` for full details):

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
GITHUB_USERNAME=your_github_username
GITHUB_PAT=your_github_personal_access_token

# Security & Revalidation Tokens (Server-only)
CRON_SECRET=your_vercel_cron_secret
REVALIDATION_SECRET=your_revalidation_secret
ADMIN_EMAILS=admin@example.com,another_admin@example.com
```

### 4. Running Locally

Run the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Modules & Roadmap

The development of this project is structured into four main modules:

1. **Module 1: Foundations & Infrastructure**
   - Base configuration (ESLint, TS Strict, directories).
   - Design System Integration ("Monochrome Elegance" tokens in Tailwind).
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
   - Authentication and route protection middleware.
   - General content editor (Hero, About, Stack, Contact, Site Meta).
   - Projects CRUD & Markdown editor for READMEs.
   - Cloudinary image uploader.
   - Message inbox for contact submissions.
4. **Module 4: Backend Services & External Integrations**
   - Contact form Server Actions (Firestore write + Email notification).
   - GitHub API Sync Cron Job.
   - On-demand ISR cache revalidation API.

## Project Guidelines

Please review `/references/agent_guidelines.md` for specific development rules, including:
- No emojis in the user interface.
- Standardized SVG icons usage.
- Strict language rules: communication in **Spanish**, code and internal documentation in **English**.
- Development practices and dependencies management with `pnpm`.
