## Why

The user wants a way for users to see recent important features as they're added, so they know what's new in TOBE without being told outside the app. There's no admin panel or backend concept of an "admin user" today, so the simplest path is a maintainer-authored list shipped with the frontend, not a new backend entity.

## What Changes

- Add a changelog: a small, hand-maintained list of dated entries (title + short description) living in the frontend codebase, updated whenever a notable feature ships.
- Add a discreet indicator in the Header (icon with a dot when there are unseen entries since the user's last visit) that opens a panel listing all entries; opening it marks everything as seen (tracked in `localStorage`, per-browser).
- Seed the initial list with the features already shipped this session (landing page, payment priority, monthly balance breakdown, income/expense split button, abono interest, savings redesign) so the list isn't empty on day one.

## Capabilities

### New Capabilities
- `changelog`: the in-app "what's new" feature — the maintained entry list, the Header indicator, and the seen/unseen tracking.

## Impact

- New `src/data/changelog.ts`: the hand-maintained list of `{ id, date, title, description }` entries, sorted newest first.
- New `src/components/ChangelogPanel.tsx` and the Header indicator button.
- `src/components/Header.tsx`: mount the new indicator/panel.
- New `src/hooks/useChangelogSeen.ts` (or similar): tracks the most-recently-seen entry id in `localStorage`.
- No backend changes.
