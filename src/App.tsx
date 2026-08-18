import { Routes, Route } from 'react-router-dom'
import { RequireAuth, RedirectIfAuthenticated } from './components/RequireAuth'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { ConceptDetail } from './pages/ConceptDetail'
import { Deudas } from './pages/Deudas'
import { Categorias } from './pages/Categorias'
import { Tareas } from './pages/Tareas'

export function App() {
  return (
    <Routes>
      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/concepts/:id" element={<ConceptDetail />} />
        <Route path="/deudas" element={<Deudas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/tareas" element={<Tareas />} />
      </Route>
    </Routes>
  )
}
