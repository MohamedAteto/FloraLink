import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlants, getAlerts } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PlantCard from '../components/PlantCard'
import AlertBanner from '../components/AlertBanner'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPlants(), getAlerts()])
      .then(([p, a]) => {
        setPlants(p.data)
        setAlerts(a.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: plants.length,
    happy: plants.filter(p => p.status === 'Happy').length,
    needsWater: plants.filter(p => p.status === 'Thirsty' || p.status === 'Stressed').length,
    avgHealth: plants.length ? Math.round(plants.reduce((s, p) => s + (p.healthScore ?? 0), 0) / plants.length) : 0
  }

  if (loading) return <div className="loading">Loading your plants…</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Good day, {user?.username} 🌱</h1>
          <p className="page-subtitle">Here's how your plants are doing</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/plants/add')}>
          + Add Plant
        </button>
      </div>

      <AlertBanner alerts={alerts} onDismiss={id => setAlerts(prev => prev.filter(a => a.id !== id))} />

      <div className="stats-row grid-4">
        <div className="stat-card card">
          <div className="stat-card-icon">🌿</div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-label">Total Plants</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-icon">😊</div>
          <div className="stat-card-value">{stats.happy}</div>
          <div className="stat-card-label">Happy Plants</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-icon">💧</div>
          <div className="stat-card-value">{stats.needsWater}</div>
          <div className="stat-card-label">Need Water</div>
        </div>
        <div className="stat-card card">
          <div className="stat-card-icon">❤️</div>
          <div className="stat-card-value">{stats.avgHealth}</div>
          <div className="stat-card-label">Avg Health Score</div>
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🪴</div>
          <h3>No plants yet</h3>
          <p>Add your first plant to start monitoring</p>
          <button className="btn btn-primary" onClick={() => navigate('/plants/add')}>Add Plant</button>
        </div>
      ) : (
        <div className="grid-3">
          {plants.map(plant => <PlantCard key={plant.id} plant={plant} />)}
        </div>
      )}
    </div>
  )
}
