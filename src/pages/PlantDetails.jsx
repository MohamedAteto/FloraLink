import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlant, getReadings, getWateringHistory, triggerWatering } from '../services/api'
import HealthRing from '../components/HealthRing'
import SensorChart from '../components/SensorChart'
import './PlantDetails.css'

const statusEmoji = { Happy: '😊', OK: '🙂', Thirsty: '😟', Stressed: '😰' }

export default function PlantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plant, setPlant] = useState(null)
  const [readings, setReadings] = useState([])
  const [watering, setWatering] = useState([])
  const [loading, setLoading] = useState(true)
  const [watering_loading, setWateringLoading] = useState(false)

  const load = async () => {
    const [p, r, w] = await Promise.all([
      getPlant(id),
      getReadings(id, 50),
      getWateringHistory(id)
    ])
    setPlant(p.data)
    setReadings(r.data)
    setWatering(w.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleWater = async () => {
    setWateringLoading(true)
    try {
      await triggerWatering({ plantId: parseInt(id), waterAmountMl: 200, notes: 'Manual watering' })
      await load()
    } finally {
      setWateringLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading plant details…</div>
  if (!plant) return <div className="loading">Plant not found.</div>

  const status = plant.status ?? 'Unknown'

  return (
    <div>
      <div className="page-header">
        <div className="plant-detail-header">
          <button className="btn btn-secondary back-btn" onClick={() => navigate('/')}>← Back</button>
          <div>
            <h1 className="page-title">{plant.name}</h1>
            <span className="plant-type-badge">{plant.plantTypeName}</span>
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn btn-secondary" onClick={() => navigate(`/diary/${id}`)}>📔 Diary</button>
          <button className="btn btn-primary" onClick={handleWater} disabled={watering_loading}>
            {watering_loading ? 'Watering…' : '💧 Water Now'}
          </button>
        </div>
      </div>

      <div className="detail-top grid-4">
        <div className="card detail-stat">
          <HealthRing score={plant.healthScore ?? 0} size={72} />
          <div className="detail-stat-label">Health Score</div>
        </div>
        <div className="card detail-stat">
          <div className="detail-big">{plant.latestMoisture != null ? `${plant.latestMoisture.toFixed(1)}%` : '—'}</div>
          <div className="detail-stat-label">💧 Soil Moisture</div>
        </div>
        <div className="card detail-stat">
          <div className="detail-big">{plant.latestTemperature != null ? `${plant.latestTemperature.toFixed(1)}°C` : '—'}</div>
          <div className="detail-stat-label">🌡️ Temperature</div>
        </div>
        <div className="card detail-stat">
          <span className={`badge badge-${status.toLowerCase()} status-badge`}>
            {statusEmoji[status] || '🌱'} {status}
          </span>
          <div className="detail-stat-label">Plant Status</div>
          {plant.predictedNextWatering && (
            <div className="predicted-watering">Next water: {plant.predictedNextWatering}</div>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3 className="chart-title">💧 Soil Moisture History</h3>
          {readings.length > 0 ? <SensorChart readings={readings} type="moisture" /> : <p className="no-data">No readings yet</p>}
        </div>
        <div className="card chart-card">
          <h3 className="chart-title">🌡️ Temperature History</h3>
          {readings.length > 0 ? <SensorChart readings={readings} type="temperature" /> : <p className="no-data">No readings yet</p>}
        </div>
      </div>

      <div className="card watering-history">
        <h3 className="section-title">💧 Watering History</h3>
        {watering.length === 0 ? (
          <p className="no-data">No watering events recorded yet.</p>
        ) : (
          <table className="watering-table">
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Type</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {watering.map(w => (
                <tr key={w.id}>
                  <td>{new Date(w.wateredAt).toLocaleString()}</td>
                  <td>{w.waterAmountMl} ml</td>
                  <td><span className={`badge ${w.isAutomatic ? 'badge-info' : 'badge-ok'}`}>{w.isAutomatic ? 'Auto' : 'Manual'}</span></td>
                  <td>{w.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
