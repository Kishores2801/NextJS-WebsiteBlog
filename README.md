# 🌐 NextJS Portfolio & Blog Website

A modern, full-stack **Portfolio Website and Blog** built with **Next.js 16**, **Sanity CMS**, and **Firebase** — featuring server-side rendering, a headless CMS backend, dark mode, math rendering, syntax-highlighted code blocks, and deployment via Firebase App Hosting.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Sanity CMS Setup](#sanity-cms-setup)
- [Firebase Setup](#firebase-setup)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Changelog](#changelog)
- [License](#license)

---

## Overview

This project is a personal **Portfolio + Blog** web application. Content (blog posts, projects, skills, etc.) is managed through [Sanity](https://www.sanity.io/) — a headless CMS — and rendered via Next.js App Router with Server Components for optimal SEO and performance.

Key highlights:
- **Headless CMS**: All content managed via Sanity Studio (embedded in the app)
- **Blog**: Rich blog posts with code blocks (Shiki syntax highlighting), math equations (KaTeX), and tables
- **Portfolio**: Projects section with Sanity-powered data
- **Dark/Light Mode**: Theme switching via `next-themes`
- **Search**: Fuzzy client-side search powered by `fuse.js`
- **SEO**: JSON-LD structured data, dynamic sitemap, and RSS feed
- **Animations**: Smooth UI transitions using `motion`
- **Hosted** on Firebase App Hosting

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, `tailwindcss-animate`, `tailwind-merge` |
| **CMS** | [Sanity v4](https://www.sanity.io/) + `next-sanity` |
| **Backend / Hosting** | Firebase (App Hosting, Functions, Admin SDK) |
| **UI Components** | Lucide React, Tabler Icons, Radix (via shadcn/ui), `react-icons` |
| **Math Rendering** | KaTeX + `react-katex` |
| **Code Highlighting** | [Shiki](https://shiki.matsu.io/) |
| **Animations** | [Motion](https://motion.dev/) |
| **Search** | [Fuse.js](https://fusejs.io/) |
| **Typewriter Effect** | `typewriter-effect` |
| **Theming** | `next-themes` |
| **Linting** | ESLint 9 |
| **Node Version** | 22 |

---

## ✨ Features

- 📝 **Blog System** — Rich content blog with Sanity as the backend, supporting code blocks, math, tables, and more
- 💼 **Portfolio / Projects Page** — Showcase your work, powered by Sanity content
- 🎨 **Design System** — Clean & modern UI based on Gestalt principles, with refined color palette and mobile-first responsive typography
- 🌙 **Dark / Light Mode** — Persistent theme switching
- 🔍 **Fuzzy Search** — Fast client-side post/project search with Fuse.js
- 🔢 **Math Support** — Render LaTeX equations inline and block via KaTeX
- 💻 **Syntax Highlighting** — Beautiful code blocks via Shiki
- ✍️ **Typewriter Effect** — Animated hero text
- 👁️ **Sanity Preview Mode** — Live preview of draft content
- 📈 **SEO Optimized** — JSON-LD structured data, dynamic `sitemap.xml`, RSS feed
- ⚡ **Performance** — Server Components for improved LCP, image optimization via `@sanity/image-url`
- 📱 **Responsive** — Mobile-first design with Tailwind CSS
- 🔥 **Firebase Hosting** — Deployed via Firebase App Hosting with `apphosting.yaml`

---

## 📁 Project Structure

```
NextJS-WebsiteBlog/
├── app/                    # Next.js App Router — pages and layouts
├── components/             # Reusable React components
├── lib/                    # Utility functions and shared logic
├── sanity/                 # Sanity schemas, queries, and configuration
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── hosting/                # Firebase hosting config files
├── .sanity/                # Sanity runtime files
├── sanity.config.ts        # Sanity Studio configuration
├── sanity.cli.ts           # Sanity CLI configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── firebase.json           # Firebase project configuration
├── apphosting.yaml         # Firebase App Hosting configuration
├── components.json         # shadcn/ui component registry
├── tsconfig.json           # TypeScript configuration
├── package.json
└── CHANGELOG.md
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** v22 or higher
- **npm** (or yarn / pnpm / bun)
- A [Sanity](https://www.sanity.io/) account and project
- A [Firebase](https://firebase.google.com/) project (for deployment)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Kishores2801/NextJS-WebsiteBlog.git
cd NextJS-WebsiteBlog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) below).

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The Sanity Studio is typically accessible at [http://localhost:3000/studio](http://localhost:3000/studio).

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=your_sanity_read_token

# Sanity Preview
SANITY_PREVIEW_SECRET=your_preview_secret

# Firebase (if using client-side Firebase features)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Site URL (for SEO / sitemap / RSS)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

> ⚠️ Never commit `.env.local` to version control. It is already listed in `.gitignore`.

---

## 🧩 Sanity CMS Setup

This project uses Sanity as a headless CMS with an embedded Sanity Studio.

1. **Create a Sanity project** at [sanity.io](https://www.sanity.io/) if you don't have one.
2. Copy your **Project ID** and **Dataset** name into `.env.local`.
3. Generate a **read token** in your Sanity project settings (API → Tokens) and add it as `SANITY_API_READ_TOKEN`.
4. Start the dev server — the Sanity Studio should be available at `/studio`.
5. Add your content schemas (defined in the `sanity/` directory) and start creating content.

### Sanity Plugins Used

| Plugin | Purpose |
|---|---|
| `@sanity/code-input` | Code block input in the Studio |
| `@sanity/table` | Table input support |
| `@sanity/vision` | GROQ query explorer in Studio |
| `@sanity/image-url` | Image URL builder |
| `@sanity/preview-url-secret` | Secure draft preview URLs |
| `sanity-plugin-iframe-pane` | Live preview pane in Studio |

---

## 🔥 Firebase Setup

This project is configured for **Firebase App Hosting**.

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Link your Firebase project:
   ```bash
   firebase use --add
   ```
4. Deploy (see [Deployment](#deployment) below).

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🚢 Deployment

### Firebase App Hosting (Recommended)

This project includes an `apphosting.yaml` and `firebase.json` for Firebase App Hosting deployment.

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

### Vercel (Alternative)

You can also deploy to [Vercel](https://vercel.com/) with zero configuration:

```bash
npx vercel
```

Make sure to add all environment variables in your Vercel project settings.

---

## 📝 Changelog

### [Unreleased]

**Added:**
- New "Clean & Modern" design system inspired by Gestalt principles, with a refined color palette, standardized spacing/radius tokens, and mobile-first responsive typography
- SEO improvements: JSON-LD structured data, dynamic sitemap, and RSS feed
- Performance: Data fetching moved to Server Components for better LCP
- Sanity Preview Mode support (Drafts vs Published)

**Changed:**
- Refactored `globals.css` to use organized CSS variables
- Updated `tailwind.config.js` with new theme tokens and animations
- Skills section redesigned with a modern "Floating Pill" / Bento Grid layout
- Project page converted to Server Component for better SEO

---

## 📄 License

This project is private. All rights reserved by [Kishores2801](https://github.com/Kishores2801).

---

<p align="center">
  Built with ❤️ using <a href="https://nextjs.org/">Next.js</a>, <a href="https://www.sanity.io/">Sanity</a>, and <a href="https://firebase.google.com/">Firebase</a>
</p>
