## 1. Data

- [x] 1.1 Create `src/hooks/useCalendarToken.ts`: `useCalendarTokenStatus()` querying `GET /calendar/token` (key `['calendar', 'token']`), `useGenerateCalendarToken()` mutation for `POST /calendar/token` invalidating that key.
- [x] 1.2 Add a `downloadAuthenticated()` helper in `src/lib/apiClient.ts` that fetches `GET /calendar/export` with the auth header attached, reads it as a blob, and triggers a browser download via a temporary object URL and `<a>` element.

## 2. UI

- [x] 2.1 Create `src/components/CalendarExportPanel.tsx`: dropdown/panel (matching `AccentColorPicker`/`ChangelogPanel`'s open/close/outside-click/Escape pattern) with a "Descargar" button calling `downloadAuthenticated()`, and a subscribe-URL section (generate button when no token exists, URL + copy + "Regenerar" once one exists).
- [x] 2.2 Build the subscribe URL client-side as `${VITE_API_BASE_URL}/calendar/subscribe/${token}` once a token is available.
- [x] 2.3 Mount the control (button + panel) in `src/pages/Agenda.tsx`.

## 3. Verification

- [x] 3.1 Run `npx tsc -b` to confirm no type errors.
- [x] 3.2 Manually verify in-browser: "Descargar" produces a real `.ics` file download; generating a subscribe URL for the first time works; reloading the page and reopening the panel shows the same URL (does not silently regenerate); "Regenerar" produces a different URL and the old one stops working (confirm via a direct request); copy-to-clipboard works.
