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

Salida estática estándar de Vite. La app usa `BrowserRouter` (rutas reales como `/agenda`, `/concepts/3`), así que un host estático necesita servir `index.html` para cualquier ruta que no sea un archivo real — `vercel.json` ya trae esa regla de rewrite.

## Despliegue

Pensado para Vercel. `vercel.json` ya trae la regla de rewrite necesaria para que el ruteo de `BrowserRouter` funcione en recargas directas de rutas anidadas.

Pasos (los haces tú desde el dashboard de Vercel, no algo que se automatice desde este repo):

1. Conecta este repositorio de GitHub a un nuevo proyecto de Vercel (el framework se detecta solo como Vite).
2. Configura estas variables de entorno en el proyecto (Vite solo las incluye en el build, no en runtime — deben estar puestas *antes* del primer build de producción):

   | Variable | Valor en Vercel |
   |---|---|
   | `VITE_API_BASE_URL` | La URL de producción del backend en Railway, una vez desplegado |
   | `VITE_GOOGLE_CLIENT_ID` | El mismo valor que tu `.env` local (mismo proyecto de Google OAuth), salvo que crees uno de producción aparte — si lo haces, agrega también la URL de producción de Vercel como origen autorizado en Google Cloud Console |

3. **Secuencia con el backend**: la URL de Vercel y la de Railway se necesitan mutuamente (`VITE_API_BASE_URL` acá, `CORS_ORIGINS` allá). Despliega primero el backend (ver su README), copia su URL, y despliégate aquí con esa URL. Luego vuelve al backend y agrega la URL de este proyecto a su `CORS_ORIGINS`.

Un workflow de CI (`.github/workflows/frontend-build.yml`) corre `tsc -b && vite build` en cada push a `main` y en cada PR — no despliega nada, solo evita que código roto llegue a `main`. El despliegue en sí lo dispara la propia integración de Vercel con GitHub, una vez conectada.

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
