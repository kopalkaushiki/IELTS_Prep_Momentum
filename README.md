# IELTS Momentum Path

A reassuring, energising prototype for IELTS prep: daily micro-missions, momentum tracking, and progress that feels meaningful. Lightly gamified and professional.

## Design system

- **Background:** White. Colour used only on important elements.
- **Accents:** Blue (progress, trust), Green (completion, success), Yellow (momentum, encouragement).
- Rounded cards, soft shadows, clean typography. Energetic and optimistic.

## Pages (3)

1. **Home** — Daily destination: momentum bar (“5 missions per week”), today’s mission card, progress toward band (skill + projection), quick flashcards.
2. **Setup** — Target band, exam date, daily time (10/15/20 min), optional weakest section. CTA: “Start My Momentum Path”.
3. **Profile** — Name/avatar, target + exam date, weekly momentum (4/5 days), skill breakdown, weekly reflection, “Adjust weekly intensity” (Light / Standard / Sprint).

## Tech

- **Front:** React, Vite. Reusable components: ProgressBar, MissionCard, FlashCard, SkillProgressCard, MomentumBadge.
- **Back:** Express (Node), in-memory store. API: user, momentum, mission complete, profile, intensity.

## Run

```bash
npm install
npm run server   # Terminal 1: API on http://localhost:3001
npm run dev     # Terminal 2: App on http://localhost:5173
```

Or both together:

```bash
npm run start
```

Vite proxies `/api` to the backend so the app and API work from one origin.

## Structure

- `src/App.jsx` — 3-page flow + bottom nav (Home, Setup, Profile).
- `src/pages/` — HomePage, SetupPage, ProfilePage.
- `src/components/` — ProgressBar, MissionCard, FlashCard, SkillProgressCard, MomentumBadge, Nav, CompletionMessage.
- `src/api.js` — API client for backend.
- `server/index.cjs` — Express API and in-memory store.

Component and colour intent are commented in the code where helpful.
