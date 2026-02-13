# FanShot - FIFA World Cup 2026 AI Photo Experience

FanShot is a mobile-first web application that lets fans create realistic AI-generated photos of themselves in FIFA World Cup 2026 scenes. Upload a selfie, choose a stadium scene and player style, and get a professional-looking AI photo in seconds. Built with Next.js 14, Zustand, Tailwind CSS, and powered by fal.ai for image generation.

## Tech Stack

- **Monorepo:** Turborepo
- **Web:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **State Management:** Zustand
- **AI Generation:** fal.ai (Flux model)
- **Auth:** Supabase Auth
- **Payments:** Stripe Checkout
- **i18n:** Custom Zustand-based system (20 languages)

## Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 10

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables (Optional)

```bash
cp .env.example apps/web/.env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key |
| `FAL_API_KEY` | No | fal.ai API key for real AI generation |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for payments |

> **No env vars needed for development!** Auth uses mock login, AI returns a placeholder image, and payments redirect to a mock success page.

### 3. Run Development Server

```bash
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build:web
```

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, how it works, pricing, FAQ, footer |
| `/login` | Login form (mock auth in dev mode — any email/password works) |
| `/register` | Registration with name, email, password, referral code |
| `/dashboard` | Main hub — hero card, quick actions, popular scenes, mascots |
| `/create` | 4-step wizard: Selfie -> Scene -> Style -> Preview -> AI Generate |
| `/gallery` | Photo gallery grid with detail modal (download, share, delete) |
| `/credits` | Credit packages: Starter ($2.99/5), Fan Pack ($6.99/15), Super Fan ($14.99/50) |
| `/credits/success` | Post-purchase confirmation page |
| `/profile` | User profile, stats, referral system, language selector, settings |
| `/share/[id]` | Public share page with OG meta tags for social sharing |

### API Routes

| Endpoint | Description |
|----------|-------------|
| `POST /api/generate` | AI photo generation (mock mode without FAL_API_KEY) |
| `POST /api/checkout` | Stripe checkout session (mock mode without STRIPE_SECRET_KEY) |
| `POST /api/webhook/stripe` | Stripe webhook for payment confirmation |

## Project Structure

```
app/
├── apps/
│   └── web/                        # Next.js web application
│       ├── app/
│       │   ├── (auth)/             # Login & Register (centered layout)
│       │   ├── (main)/             # Dashboard, Create, Gallery, Credits, Profile
│       │   │   ├── dashboard/
│       │   │   ├── create/
│       │   │   ├── gallery/
│       │   │   ├── credits/
│       │   │   └── profile/
│       │   ├── api/                # API routes (generate, checkout, webhook)
│       │   └── share/[id]/         # Public share pages
│       └── src/
│           ├── components/
│           │   ├── auth/           # AuthInput
│           │   ├── create/         # CreateWizard, Step1-4, Loading, Result, Error
│           │   ├── dashboard/      # HeroCard, QuickActions, PopularScenes, Mascots
│           │   ├── gallery/        # GalleryView (grid + detail modal)
│           │   ├── landing/        # LandingPage
│           │   ├── layout/         # MobileLayout, Header, BottomTabBar
│           │   ├── legal/          # AiDisclaimerModal, AiFooterBanner
│           │   ├── profile/        # ProfileView (stats, referral, settings)
│           │   ├── providers/      # ToastProvider, I18nProvider, AiFooterProvider
│           │   └── ui/             # GoldButton, CreditBadge, LanguageSelector
│           ├── hooks/              # useAuth
│           ├── lib/                # i18n, supabase, supabase-middleware, prompts
│           ├── messages/           # Translation files (20 languages)
│           └── stores/             # authStore, createStore, creditStore, galleryStore, toastStore
├── packages/
│   └── shared/                     # Shared TypeScript types
├── .env.example                    # Environment variable template
├── turbo.json                      # Turborepo configuration
└── package.json                    # Root scripts
```

## Key Features

- **AI Photo Generation:** Upload selfie + choose scene/style = realistic World Cup photo
- **AI Legal Disclaimer System:** First-use modal, per-generation checkbox, result banner, watermark overlay
- **Credit System:** 1 free credit on signup, purchasable packages via Stripe
- **Social Sharing:** Download PNG, Instagram (download + caption copy), X/Twitter, WhatsApp, link copy
- **Gallery:** View past generations in 2-column grid, detail modal with download/share/delete
- **Profile:** Avatar, stats (total/credits/shares), referral codes, language selector, settings
- **20 Languages:** EN, TR, ES, PT, FR, DE, IT, NL, RU, AR, ZH, JA, KO, HI, PL, SV, DA, NO, RO, ID
- **Mobile-First Design:** Optimized for 375px+, bottom tab navigation, safe area support
- **Dark Theme:** Stadium-inspired dark design with gold + pitch green accents

## Dev Mode Behavior

The app is fully functional without any environment variables:

| Feature | Dev Behavior |
|---------|-------------|
| **Auth** | Mock login/register — any email/password creates a session |
| **AI Generation** | Returns a placeholder image after 2.5s simulated delay |
| **Payments** | Redirects to mock success page, credits added to local store |
| **Middleware** | Auth checks bypassed, all routes freely accessible |

## Scripts

```bash
npm run dev:web       # Start web dev server (http://localhost:3000)
npm run build:web     # Production build
npm run build         # Build all packages
npm run lint          # Lint all packages
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
```
