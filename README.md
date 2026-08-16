# Finanzapp Frontend

App en React + TypeScript que consume la API de [FinanzappBackend](../FinanzappBackend) (repo hermano): login con Google, presupuesto mensual, deudas con amortización real, y una vista de tendencia anual.

Ver la planeación completa en `openspec/specs/` (specs vigentes) y en los changes archivados: `openspec/changes/archive/2026-08-15-add-frontend-mvp/`, `openspec/changes/archive/2026-08-15-add-debt-analytics-ui/`.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (modo claro/oscuro por clase, mobile-first)
- **React Router** para navegación
- **TanStack Query** para todo el estado del servidor (conceptos, entradas, resumen, deudas)
- **Recharts** para las gráficas (tendencia anual, composición de deudas) — paleta y convenciones del skill `dataviz` de este proyecto, no colores inventados a ojo
- **Context de React** (no una librería de estado global) para la sesión autenticada
- **`@react-oauth/google`** para el flujo de Google Sign-In

## Diseño

Dirección visual: "editorial ledger" — Fraunces (display serif) + Manrope (sans), paleta cálida papel/tinta con verde como acento. La vista de detalle de concepto usa una línea de tiempo vertical agrupada por trimestre (no una grilla tipo Excel), con un anillo de progreso para deudas que muestra cuánto se ha pagado.

Los colores de las gráficas (`--viz-*` en `index.css` / `src/lib/vizColors.ts`) son un set **separado** de los colores decorativos de la UI (`--accent`/`--warn`/`--danger`) — estos últimos fallaron la validación de separación CVD al probarlos como par categórico de una gráfica, así que las gráficas usan la paleta categórica validada del skill `dataviz` en su lugar.

## Correr en local

```bash
npm install
cp .env.example .env   # completa VITE_API_BASE_URL y VITE_GOOGLE_CLIENT_ID
npm run dev
```

Requiere que `FinanzappBackend` esté corriendo (ver su README) y que su `CORS_ORIGINS` incluya el origen de este dev server (`http://localhost:5173` por defecto). Si el login real de Google no está disponible, usa el botón "Entrar como invitado (solo desarrollo)" en la pantalla de Login (requiere `DEV_MODE=true` en el backend) — ese botón no existe en el build de producción.

## Build de producción

```bash
npm run build   # tsc -b && vite build -> dist/
```

Salida estática estándar de Vite, compatible con Vercel sin configuración adicional. Variables de entorno (`VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`) se configuran por ambiente en Vercel, nunca hardcodeadas.

## Estructura

```
src/
  pages/           # Login, Dashboard, ConceptDetail, Deudas
  components/      # Header, NewConceptForm, MonthEntryRow, ProgressRing,
                    # AnnualTrendChart, DebtCompositionChart, RequireAuth
  context/         # AuthContext (sesión JWT + usuario)
  hooks/           # useConcepts, useEntries, useSummary, useAnnualTrend,
                    # useDebtsSummary, useDashboardConcepts, useTheme
  lib/             # apiClient (fetch wrapper), session (persistencia),
                    # format (COP, meses), vizColors (paleta de gráficas)
  types.ts         # tipos que reflejan los schemas del backend
```

## Notas de integración con el backend

- El backend no tiene endpoint `/me`; la info del usuario (nombre/email) para mostrar en UI se decodifica del propio ID token de Google al iniciar sesión — nunca se usa para autorizar, solo para mostrar.
- El backend no tiene un endpoint de "todas las entradas de todos los conceptos de un mes"; el Dashboard hace un fetch por concepto (`useDashboardConcepts`) y filtra al mes seleccionado en el cliente. Aceptable a esta escala (unas pocas decenas de conceptos por usuario); revisar si crece.
- `apiClient` inicializa el token de sesión de forma síncrona desde `localStorage` al cargar el módulo (no en un `useEffect` de `AuthContext`) — evita una condición de carrera real donde la primera petición tras recargar la página podía salir sin token y disparar un logout automático.
- Crear una deuda con tasa de interés y número de cuotas activa el cálculo de amortización del backend; esos campos (junto con `valor_total`) quedan inmutables después — la app nunca ofrece editarlos, solo mostrarlos.
