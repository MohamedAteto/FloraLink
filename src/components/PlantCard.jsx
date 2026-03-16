import { useNavigate } from 'react-router-dom'
import HealthRing from './HealthRing'
import './PlantCard.css'

const statusEmoji = { Happy: '😊', OK: '🙂', Thirsty: '😟', Stressed: '😰' }

export default function PlantCard({ plant }) {
  const navigate = useNavigate()
  const score = plant.healthScore ?? 0
  const status = plant.status ?? 'Unknown'

  return (
    <div className="plant-card card" onClick={() => navigate(`/plants/${plant.id}`)}>
      <div className="plant-card-header">
        <div>
          <h3 className="plant-name">{plant.name}</h3>
          <span className="plant-type">{plant.plantTypeName}</span>
        </div>
        <HealthRing score={score} size={56} />
      </div>

      <div className="plant-stats">
        <div className="stat">
          <span className="stat-icon">💧</span>
          <div>
            <div className="stat-value">{plant.latestMoisture != null ? `${plant.latestMoisture.toFixed(1)}%` : '—'}</div>
            <div className="stat-label">Moisture</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">🌡️</span>
          <div>
            <div className="stat-value">{plant.latestTemperature != null ? `${plant.latestTemperature.toFixed(1)}°C` : '—'}</div>
            <div className="stat-label">Temperature</div>
          </div>
        </div>
      </div>

      <div className="plant-card-footer">
        <span className={`badge badge-${status.toLowerCase()}`}>
          {statusEmoji[status] || '🌱'} {status}
        </span>
        {plant.predictedNextWatering && (
          <span className="next-watering">💧 {plant.predictedNextWatering}</span>
        )}
      </div>
    </div>
  )
}
