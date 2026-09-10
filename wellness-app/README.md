# Wellness Circle — MVP Scaffold

A group goal-tracking + accountability app, built with **Expo (React Native)**
so one codebase runs on iOS, Android, and (later) web.

Right now the app runs entirely on **mock, in-memory data** — no backend, no
sign-up needed — so you can see and touch the real thing today. Wiring in a
real multi-user backend is Phase 2 (below).

---

## 1. Run it today (15 minutes)

You need Node.js installed (nodejs.org — get the LTS version) and the
**Expo Go** app on your phone (free, App Store / Google Play).

```bash
cd wellness-app
npm install
npx expo start
```

A QR code will appear in your terminal. Scan it with your phone's camera
(iOS) or the Expo Go app (Android). The app opens live on your phone.

Change any text in `src/screens/GoalsScreen.js`, save, and watch it update
on your phone instantly — that's the whole dev loop.

---

## 2. What's already built

| Tab | What it does | File |
|---|---|---|
| **Home** | Shows today's outstanding tasks across every group and personal goal — tap one to check in Done/Missed right there. A recent-activity strip underneath shows what your circles are up to. | `src/screens/HomeScreen.js` |
| **Chat** | One message thread per group. Beta-level on purpose — plain text, no moderation yet (that's a Phase 2 item, see below). | `src/screens/ChatScreen.js` |
| **Goals** | Shows each group and its shared goals with weekly progress bars. Tap "+ Add a group goal" to create one. | `src/screens/GoalsScreen.js` |
| **Personal** | Private goals only you can see, plus a preferences section (notification toggle for now). | `src/screens/PersonalScreen.js` |

All four tabs share one data store (`src/data/AppStore.js`), so a check-in
on Home immediately updates the progress bar on Goals and posts to the
feed. That wiring is the hard part of the "bones" — it's done.

---

## 3. Phase 2 — Next 13 days

You don't need to build this alone from scratch. Once you're ready, open
this same project folder in **Claude Code** (a coding assistant that can
write and run code with you) and work through this roughly in order:

**Days 1–2 — Get it running, get familiar**
- Run the app above, click through it, get comfortable editing text/colors.
- Decide your real groups/goals for launch (even 5 beta testers is plenty).

**Days 3–5 — Real backend (Supabase)**
- Create a free Supabase project (supabase.com) — it gives you a database,
  user login, and real-time sync without writing server code.
- Replace `src/data/mockData.js` reads with real Supabase queries. Tables
  you'll want: `users`, `groups`, `group_members`, `goals`, `checkins`.
- Add sign-up/login (email or phone).

**Days 6–8 — Wire Check-Ins to the real backend**
- Check-in submissions write to the `checkins` table instead of local state.
- Add a simple daily reminder notification (Expo has a built-in
  notifications API) — this is what actually drives "accountability."
- Wire Chat to Supabase real-time so messages sync across devices/users
  (currently chat is local-only mock data, fine for demoing solo).

**Before any public launch — Chat moderation**
- The current chat is intentionally bare-bones for the competition demo.
  Before real strangers can join groups, add: a report/block button per
  message, basic profanity/spam filtering, and a way for a group creator
  to remove a member. Don't skip this step for a public release.

**Days 9–10 — Real Feed + invites**
- Feed reads from real check-ins across a user's groups.
- Add a basic "invite a friend to this group" flow (share a join code/link).

**Days 11–12 — Polish + test with real people**
- Get 3–5 friends to actually use it for two days. Fix what breaks.
- Add empty states (new user, no groups yet) and basic error handling.

**Day 13 — Buffer**
- Something will have gone sideways. This day exists for that.

---

## 4. Cut-scope list (things to explicitly NOT build for the MVP)

To protect the 13-day deadline, deliberately skip for now:
- Streaks/leaderboards (your 4th priority — good V2 feature)
- Push notification infra beyond basic reminders
- Profile customization, avatars, settings screens
- Any payment/subscription logic

---

## Project structure

```
wellness-app/
├── App.js                     # Entry point
├── src/
│   ├── data/
│   │   ├── mockData.js        # Sample groups/goals/checkins — swap for Supabase in Phase 2
│   │   └── AppStore.js        # Shared state all screens read/write from
│   ├── navigation/index.js    # Bottom tab bar (Goals / Check In / Feed)
│   ├── screens/
│   │   ├── GoalsScreen.js
│   │   ├── CheckInScreen.js
│   │   └── FeedScreen.js
│   ├── components/
│   │   ├── GoalCard.js
│   │   └── ProgressBar.js
│   └── theme/theme.js         # Colors/spacing — change here to reskin the whole app
```
