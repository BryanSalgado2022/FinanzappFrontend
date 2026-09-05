## Why

Sibling to the backend's `add-calendar-export`. There's no way from the app to reach the new `.ics` download or subscribe endpoints.

## What Changes

- Add an "Exportar calendario" control on the Agenda screen, opening a small panel with two actions: "Descargar" (downloads the `.ics` file for the currently authenticated user) and a "Suscribirse" URL (generated/regenerated on demand, shown with a copy-to-clipboard control and a "Regenerar" action).

## Capabilities

### Modified Capabilities
- `agenda`: gains the calendar export control described above.

## Impact

- New `src/hooks/useCalendarToken.ts`: `GET /calendar/token` (status) and `POST /calendar/token` (generate/regenerate) queries/mutations.
- New `src/components/CalendarExportPanel.tsx`.
- `src/pages/Agenda.tsx`: mount the control.
- `src/lib/apiClient.ts` (or a small dedicated helper): the download action needs the raw `.ics` bytes with the auth header attached, not JSON — `apiClient`'s `request()` always parses JSON, so this needs its own fetch call rather than reusing `apiClient.get`.
