import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PlantDetails from './pages/PlantDetails'
import AddPlant from './pages/AddPlant'
import Analytics from './pages/Analytics'
import GrowthDiary from './pages/GrowthDiary'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="plants/add" element={<AddPlant />} />
            <Route path="plants/:id" element={<PlantDetails />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="diary/:plantId" element={<GrowthDiary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
