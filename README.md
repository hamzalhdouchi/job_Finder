# JobFinder

A modern Job Board Application built with Angular 17+ (Standalone), NgRx, and Tailwind CSS.

## 🚀 Technology Stack
- **Frontend**: Angular 21 (Standalone Components)
- **State Management**: NgRx (Store, Effects, Router-Store)
- **Styling**: Tailwind CSS v3
- **Routing**: Angular Router (Lazy Loading)
- **Mock Backend**: JSON Server

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Mock Backend**
   ```bash
   npm run server
   ```
   *Runs on http://localhost:3000*

3. **Run Application**
   ```bash
   npm start
   ```
   *Runs on http://localhost:4200*

## 📂 Project Structure
- `src/app/core`: Singleton services, guards (AuthGuard), interceptors (ErrorInterceptor).
- `src/app/shared`: Reusable UI components.
- `src/app/features`: Domain features (Auth, Jobs, Favorites, Applications, Profile).
- `src/environments`: Environment configuration.

## ✨ Features
- **Job Search**: Browse and filter job offers.
- **Favorites**: Save interesting jobs (using NgRx).
- **Applications**: Track job application status.
- **Authentication**: User role management (Candidate/Recruiter).
