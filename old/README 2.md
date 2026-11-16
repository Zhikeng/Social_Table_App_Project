# Social Table — React Native Frontend

A full-stack-ready mobile frontend (Expo / React Native) for a social dining app that
combines **restaurant table booking** with a **social food feed**.

This is the **UI/frontend only**, wired to mock data through a lightweight in-memory
`AppContext` so every flow works end-to-end today. Swap the context's functions for real
API calls when your backend is ready — the screens don't need to change.

## Features implemented

| Area | Screens |
|---|---|
| **Auth** | Login, Signup (mock — any input logs you in) |
| **Table Booking** | Discover (search + cuisine filters), Restaurant Detail (menu, reviews, tags), Booking flow (date/time/party size), My Bookings (upcoming/past, cancel) |
| **Social Feed** | Feed (photo posts, like, rating), Post Detail (full comment thread), Create Post (pick restaurant, star rating, photo picker, caption) |
| **Reviews** | Star ratings on posts, reviews surfaced on each restaurant's detail page |
| **Profile** | Avatar/bio/stats, tabs for Posts grid / Saved restaurants / Bookings, Edit Profile |

Navigation: one root stack (Auth vs Main) → bottom tabs (Discover, Feed, Bookings, Profile),
each with its own stack so restaurant detail / booking / post detail can be pushed from
any tab.

## Project structure

```
SocialTable/
├── App.js                     # Entry point
├── app.json / babel.config.js
├── src/
│   ├── theme/                 # colors.js, typography.js — design tokens
│   ├── data/mockData.js       # Mock restaurants, users, posts, bookings
│   ├── context/AppContext.js  # Global state: auth, feed, bookings, saved spots
│   ├── navigation/
│   │   ├── RootNavigator.js
│   │   └── MainTabNavigator.js
│   ├── components/            # RestaurantCard, PostCard, StarRating, TimeSlotPicker, Avatar, Header
│   └── screens/
│       ├── Auth/              # LoginScreen, SignupScreen
│       ├── Discover/          # DiscoverScreen, RestaurantDetailScreen
│       ├── Booking/           # BookingScreen, MyBookingsScreen
│       ├── Feed/              # FeedScreen, PostDetailScreen, CreatePostScreen
│       └── Profile/           # ProfileScreen, EditProfileScreen
```

## Running it

Requires Node 18+ and the Expo Go app (or a simulator).

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a simulator,
or `w` for a quick web preview.

## Design notes

- **Palette**: warm coral primary + deep herb green secondary + saffron accent — deliberately
  food-forward rather than a generic blue SaaS look. All colors/spacing/radii live in
  `src/theme/colors.js` so re-skinning is a one-file change.
- **Mock-data-first**: `mockData.js` + `AppContext.js` simulate a backend so you can click
  through booking a table, posting a review, liking/commenting, and saving spots without
  a server. Replace the functions inside `AppContext.js` (`login`, `addBooking`, `addPost`,
  `toggleLike`, `addComment`, `toggleSaved`) with real API/fetch calls — screens consume
  them via `useApp()` and don't know the difference.

## Next steps for a real backend

- Replace `AppContext` mock functions with API calls (REST/GraphQL) and add loading/error states.
- Add real auth (JWT/session) instead of the mock `login()`.
- Add pagination to Feed and Discover lists.
- Push notifications for booking confirmations and social activity (likes/comments/follows).
- Real-time updates (WebSocket or Firestore/Supabase realtime) for the feed and "friends dining now".
