import { markAlertRead } from '../services/api'
import './AlertBanner.css'

export default function AlertBanner({ alerts, onDismiss }) {
  if (!alerts?.length) return null

  const handleDismiss = async (id) => {
    await markAlertRead(id)
    onDismiss(id)
  }

  return (
    <div className="alert-list">
      {alerts.slice(0, 5).map(alert => (
        <div key={alert.id} className={`alert-item alert-${alert.severity.toLowerCase()}`}>
          <span className="alert-icon">
            {alert.severity === 'Critical' ? '🚨' : alert.severity === 'Warning' ? '⚠️' : 'ℹ️'}
          </span>
          <div className="alert-content">
            <span className="alert-plant">{alert.plantName}</span>
            <span className="alert-msg">{alert.message}</span>
          </div>
          <button className="alert-dismiss" onClick={() => handleDismiss(alert.id)} aria-label="Dismiss alert">✕</button>
        </div>
      ))}
    </div>
  )
}
