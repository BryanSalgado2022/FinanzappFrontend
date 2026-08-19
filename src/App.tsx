import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RequireAuth, RedirectIfAuthenticated } from './components/RequireAuth'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Agenda } from './pages/Agenda'
import { ConceptDetail } from './pages/ConceptDetail'
import { Deudas } from './pages/Deudas'
import { Categorias } from './pages/Categorias'
import { Tareas } from './pages/Tareas'
import { Deudores } from './pages/Deudores'
import { DeudorDetail } from './pages/DeudorDetail'
import { Gastos } from './pages/Gastos'
import { useCurrentUser } from './hooks/useAccentColor'
import { getAccentColorPreset } from './lib/accentColors'

export function App() {
  const currentUser = useCurrentUser()

  // Sets both light/dark hex values whenever the saved preference changes -
  // :root/.dark each pick their own half via CSS, so this never needs to
  // know or track which theme is currently active (see index.css).
  useEffect(() => {
    if (!currentUser.data) return
    const preset = getAccentColorPreset(currentUser.data.color_acento)
    document.documentElement.style.setProperty('--accent-override-light', preset.light)
    document.documentElement.style.setProperty('--accent-override-dark', preset.dark)
  }, [currentUser.data])

  return (
    <Routes>
      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/concepts/:id" element={<ConceptDetail />} />
        <Route path="/deudas" element={<Deudas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/deudores" element={<Deudores />} />
        <Route path="/deudores/:id" element={<DeudorDetail />} />
        <Route path="/gastos" element={<Gastos />} />
      </Route>
    </Routes>
  )
}
