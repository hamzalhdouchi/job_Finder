# 💼 JobFinder

> A modern **Single Page Application** for searching, saving, and tracking job opportunities from international sources — built with **Angular 21** and **NgRx**.

 Angular 21 ·  NgRx 21 ·  Tailwind CSS 3.4 ·  JSON Server ·  Adzuna API ·  TypeScript 5.9

---

##  Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Integration](#-api-integration)
- [State Management (NgRx)](#-state-management-ngrx)
- [Authentication](#-authentication)
- [Key Technical Highlights](#-key-technical-highlights)
- [Scripts](#-scripts)

---

##  Overview

**JobFinder** allows job seekers to search thousands of international job offers through the **Adzuna API**, save favorites, and track their application statuses — all within a fully responsive, client-side application. Data is persisted via **JSON Server** simulating a REST backend.

---

##  Features

###  Authentication
- User registration (first name, last name, email, password)
- Login with email/password verification against JSON Server
- Session management via `sessionStorage` (active for current browser session only)
- Password hashing (base64 salted) for basic security
- Protected routes with `AuthGuard`

###  Job Search
- Search by **keyword** (title-only matching via Adzuna `title_only` param)
- Filter by **location**, **country** (13+ countries), **contract type**, **salary**, **category**
- Results sorted by **publication date** (newest first)
- Loading indicators during API calls
- Infinite scroll pagination (10 results per batch)
- Direct link to original job posting on the source website

###  Favorites Management (NgRx)
- Add/remove jobs to personal favorites
- Visual indicator when a job is already favorited
- Duplicate prevention (server-side check before insert)
- Dedicated favorites page
- Full NgRx state management (actions → effects → reducer → selectors)

###  Application Tracking
- Track job applications with statuses: **En attente** → **Accepté** / **Refusé**
- Add personal notes to each application
- Delete tracked applications
- Dedicated applications page

###  Profile Management
- Edit personal information (first name, last name, email)
- Change password with strength validation
- Delete account with confirmation (type "DELETE" to confirm)

---

##  Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 21 | Frontend framework (standalone components) |
| **NgRx** | 21 | State management (Favorites + Auth stores) |
| **RxJS** | 7.8 | Reactive programming & Observables |
| **Tailwind CSS** | 3.4 | Utility-first styling & responsive design |
| **TypeScript** | 5.9 | Type-safe development |
| **JSON Server** | — | Mock REST API (users, favorites, applications) |
| **Adzuna API** | v1 | Public job search API |
| **Vitest** | 4.0 | Unit testing framework |

---

##  Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Angular SPA                      │
│                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────────────┐ │
│  │  Auth     │   │  Jobs    │   │  Favorites       │ │
│  │  Module   │   │  Module  │   │  Module (NgRx)   │ │
│  └────┬─────┘   └────┬─────┘   └────┬─────────────┘ │
│       │              │              │                │
│  ┌────▼──────────────▼──────────────▼──────────────┐ │
│  │              Core Services                       │ │
│  │  AuthService · JobService · FavoritesService     │ │
│  │  ApplicationsService · ErrorInterceptor          │ │
│  └────────────────────┬────────────────────────────┘ │
│                       │                              │
└───────────────────────┼──────────────────────────────┘
                        │ HTTP
          ┌─────────────┼─────────────┐
          ▼                           ▼
   ┌──────────────┐          ┌───────────────┐
   │  JSON Server  │          │  Adzuna API   │
   │  :3000        │          │  (via proxy)  │
   │               │          │               │
   │  • users      │          │  Job search   │
   │  • favorites  │          │  13+ countries│
   │  • applications│         └───────────────┘
   └──────────────┘
```

### NgRx Data Flow

```
Component ──dispatch──▶ Action ──▶ Effect ──▶ Service (HTTP)
                                      │
                                      ▼
Component ◀──select──── Selector ◀── Reducer ◀── Action (Success / Failure)
```

---

##  Project Structure

```
src/
├── app/
│   ├── app.config.ts              # App providers (Router, HttpClient, NgRx)
│   ├── app.routes.ts              # Root routes with lazy loading
│   ├── app.ts                     # Root component
│   │
│   ├── core/                      # Singleton services & cross-cutting concerns
│   │   ├── guards/
│   │   │   └── auth.guard.ts      # AuthGuard, GuestGuard
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts  # Centralized HTTP error handling
│   │   ├── models/
│   │   │   └── job.model.ts       # Job & Adzuna API interfaces
│   │   ├── resolvers/
│   │   │   └── user.resolver.ts   # Pre-fetch user data
│   │   ├── services/
│   │   │   ├── auth.service.ts        # Login, register, session, CRUD
│   │   │   ├── job.service.ts         # Adzuna API integration + caching
│   │   │   ├── favorites.service.ts   # Favorites CRUD via JSON Server
│   │   │   └── applications.service.ts# Applications CRUD via JSON Server
│   │   └── store/auth/            # Auth NgRx (actions, effects, reducer, selectors)
│   │
│   ├── features/                  # Lazy-loaded feature modules
│   │   ├── auth/                  # Login & Register pages
│   │   │   ├── login/             #   LoginComponent (ReactiveFormsModule)
│   │   │   ├── register/          #   RegisterComponent (ReactiveFormsModule)
│   │   │   └── components/        #   AuthBranding, PasswordStrength
│   │   ├── home/                  # Landing page + FeaturedJobs child component
│   │   ├── jobs/                  # Job search + JobDetailPanel child component
│   │   ├── favorites/             # Favorites list + FavoriteCard + NgRx store
│   │   ├── applications/          # Applications list + ApplicationCard
│   │   └── profile/               # Profile edit + DangerZone child component
│   │
│   └── shared/                    # Reusable components & pipes
│       ├── components/
│       │   ├── header/            # Navigation header (responsive + mobile menu)
│       │   ├── footer/            # Footer
│       │   └── job-card/          # Reusable job card (Input/Output)
│       └── pipes/
│           └── time-ago.pipe.ts   # Relative date pipe ("2 days ago")
│
├── environments/
│   ├── environment.ts             # Production config
│   └── environment.development.ts # Dev config (Adzuna API keys)
│
├── db.json                        # JSON Server database
├── proxy.conf.json                # Dev proxy config
└── tailwind.config.js             # Tailwind configuration
```

---

##  Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/JobFinder.git
cd JobFinder

# 2. Install dependencies
npm install
```

### Running the Application

You need **two terminals** running simultaneously:

**Terminal 1 — JSON Server (mock backend)**
```bash
npm run server
```
> Starts on `http://localhost:3000` — serves `db.json`

**Terminal 2 — Angular Dev Server**
```bash
npx ng serve --proxy-config proxy.conf.json
```
> Starts on `http://localhost:4200` with proxy for API calls

### Build for Production

```bash
npm run build
```

---

##  API Integration

### Adzuna API (Public Job Search)
| Detail | Value |
|--------|-------|
| **Website** | [adzuna.com](https://www.adzuna.com/) |
| **Endpoint** | `/v1/api/jobs/{country}/search/{page}` |
| **Proxy** | `/api/adzuna/*` → `https://api.adzuna.com` |
| **Search** | `title_only` param for keyword-in-title matching |
| **Countries** | US, UK, Canada, Australia, Germany, France, India, Netherlands, NZ, Singapore, South Africa, Brazil, Mexico |

### JSON Server (Local REST API)
| Table | Content |
|-------|---------|
| `users` | User accounts (email, hashed password, name, createdAt) |
| `favoritesOffers` | Saved jobs per user (userId, offerId, title, company, location) |
| `applications` | Tracked applications (userId, status, notes, dateAdded) |

---

##  State Management (NgRx)

### Registered Stores

| Store | Location | Manages |
|-------|----------|---------|
| **Auth** | `core/store/auth/` | User session, login, register, logout, profile update, password change, account deletion |
| **Favorites** | `features/favorites/store/` | Favorite offers CRUD, loading states, success/error messages |

### Auth Store — Actions
`login` · `loginSuccess` · `loginFailure` · `register` · `logout` · `updateProfile` · `changePassword` · `deleteAccount`

### Favorites Store — Actions
`loadFavorites` · `addFavorite` · `removeFavorite` · `updateFavoriteNotes`

### Selectors (examples)
- `selectUser` — current logged-in user
- `selectIsAuthenticated` — boolean auth state
- `selectAllFavorites` — array of saved offers
- `selectIsFavorite(offerId)` — check if a specific job is favorited

>  **Redux DevTools** is enabled in development mode via `provideStoreDevtools()` — install the browser extension to inspect state changes.

---

##  Authentication

### Flow

```
1. User submits login form (Reactive Form with validation)
2. AuthService → GET /users?email=...
3. Password verified (hashed comparison)
4. User object (without password) stored in sessionStorage
5. AuthGuard checks session validity on protected routes
6. Session expires after 24 hours
```

### Why `sessionStorage`?
| Reason | Explanation |
|--------|-------------|
| **Security** | Session active only during the browser tab |
| **Auto-cleanup** | Data cleared when the tab is closed |
| **Shared computers** | No stale sessions persisting across restarts |

### Protected Routes
| Route | Guard | Description |
|-------|-------|-------------|
| `/favorites` | `authGuard` | Saved job offers |
| `/applications` | `authGuard` | Application tracking |
| `/profile` | `authGuard` | User profile management |

---

##  Key Technical Highlights

| Concept | Implementation |
|---------|---------------|
| **Standalone Components** | All components use `standalone: true` (no NgModules) |
| **Lazy Loading** | Auth, Jobs, Favorites, Applications, Profile — all lazy-loaded via `loadChildren` |
| **Reactive Forms** | Login, Register, Profile edit, Password change — with validators & error messages |
| **NgRx** | Auth + Favorites stores with full action/effect/reducer/selector pattern |
| **RxJS Operators** | `switchMap`, `exhaustMap`, `catchError`, `takeUntil`, `debounceTime`, `BehaviorSubject` |
| **Dependency Injection** | Modern `inject()` function used throughout |
| **Guards** | `authGuard` (protected routes), `guestGuard` (redirect logged-in users) |
| **Resolver** | `userResolver` pre-fetches user data before route activation |
| **Interceptors** | `errorInterceptor` for centralized HTTP error handling with user-friendly messages |
| **Custom Pipes** | `TimeAgoPipe` for relative date display ("2 days ago") |
| **Component Composition** | Every page contains 2+ components (parent/child pattern) |
| **Responsive Design** | Mobile menu, responsive grids, Tailwind breakpoints (`sm:`, `md:`, `lg:`) |
| **API Caching** | Job search results cached in memory for 5 minutes |
| **Proxy Config** | Adzuna API proxied via `proxy.conf.json` to avoid CORS issues |

---

##  Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start Angular dev server (`localhost:4200`) |
| `npm run server` | Start JSON Server (`localhost:3000`) |
| `npm run build` | Production build |
| `npm run test` | Run unit tests (Vitest) |

---

##  Author

**Hamza Alhadouchi**

---
