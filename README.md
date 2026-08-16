# Finanzapp Frontend

App en React + TypeScript que consume la API de [FinanzappBackend](../FinanzappBackend) (repo hermano): login con Google, presupuesto mensual, y manejo de deudas/gastos fijos/ingresos mes a mes.

Ver la planeación completa en `openspec/changes/add-frontend-mvp/` — `proposal.md`, `specs/`, `design.md`, `tasks.md`.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (modo claro/oscuro por clase, mobile-first)
- **React Router** para navegación
- **TanStack Query** para todo el estado del servidor (conceptos, entradas, resumen)
- **Context de React** (no una librería de estado global) para la sesión autenticada
- **`@react-oauth/google`** para el flujo de Google Sign-In

## Diseño

Dirección visual: "editorial ledger" — Fraunces (display serif) + Manrope (sans), paleta cálida papel/tinta con verde como acento. La vista de detalle de concepto usa una línea de tiempo vertical agrupada por trimestre (no una grilla tipo Excel), con un anillo de progreso para deudas que muestra cuánto se ha pagado.

## Correr en local

```bash
npm install
cp .env.example .env   # completa VITE_API_BASE_URL y VITE_GOOGLE_CLIENT_ID
npm run dev
```

Requiere que `FinanzappBackend` esté corriendo (ver su README) y que su `CORS_ORIGINS` incluya el origen de este dev server (`http://localhost:5173` por defecto).

## Build de producción

```bash
npm run build   # tsc -b && vite build -> dist/
```

Salida estática estándar de Vite, compatible con Vercel sin configuración adicional. Variables de entorno (`VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`) se configuran por ambiente en Vercel, nunca hardcodeadas.

## Estructura

```
src/
  pages/           # Login, Dashboard, ConceptDetail
  components/      # Header, NewConceptForm, MonthEntryRow, ProgressRing, RequireAuth
  context/         # AuthContext (sesión JWT + usuario)
  hooks/           # useConcepts, useEntries, useSummary, useDashboardConcepts, useTheme
  lib/             # apiClient (fetch wrapper), session (persistencia), format (COP, meses)
  types.ts         # tipos que reflejan los schemas del backend
```

## Notas de integración con el backend

- El backend no tiene endpoint `/me`; la info del usuario (nombre/email) para mostrar en UI se decodifica del propio ID token de Google al iniciar sesión — nunca se usa para autorizar, solo para mostrar.
- El backend no tiene un endpoint de "todas las entradas de todos los conceptos de un mes"; el Dashboard hace un fetch por concepto (`useDashboardConcepts`) y filtra al mes seleccionado en el cliente. Aceptable a esta escala (unas pocas decenas de conceptos por usuario); revisar si crece.
- `apiClient` inicializa el token de sesión de forma síncrona desde `localStorage` al cargar el módulo (no en un `useEffect` de `AuthContext`) — evita una condición de carrera real donde la primera petición tras recargar la página podía salir sin token y disparar un logout automático.
