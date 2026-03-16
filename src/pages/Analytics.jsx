import { useEffect, useState } from 'react'
import { getPlants, getReadings } from '../services/api'
import SensorChart from '../components/SensorChart'
import './Analytics.css'

export default function Analytics() {
  const [plants, setPlants] = useState([])
  const [selected, setSelected] = useState(null)
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlants().then(r => {
      setPlants(r.data)
      if (r.data.length > 0) setSelected(r.data[0].id)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selected) {
      getReadings(selected, 100).then(r => setReadings(r.data))
    }
  }, [selected])

  if (loading) return <div className="loading">Loading analytics…</div>

  const plant = plants.find(p => p.id === selected)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <select className="plant-selector" value={selected ?? ''} onChange={e => setSelected(parseInt(e.target.value))}>
          {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {plant && (
        <div className="analytics-summary grid-4">
          <div className="card summary-card">
            <div className="summary-label">Total Readings</div>
            <div className="summary-value">{readings.length}</div>
          </div>
          <div className="card summary-card">
            <div className="summary-label">Avg Moisture</div>
            <div className="summary-value">
              {readings.length ? (readings.reduce((s, r) => s + r.soilMoisture, 0) / readings.length).toFixed(1) + '%' : '—'}
            </div>
          </div>
          <div className="card summary-card">
            <div className="summary-label">Avg Temperature</div>
            <div className="summary-value">
              {readings.length ? (readings.reduce((s, r) => s + r.temperature, 0) / readings.length).toFixed(1) + '°C' : '—'}
            </div>
          </div>
          <div className="card summary-card">
            <div className="summary-label">Avg Health Score</div>
            <div className="summary-value">
              {readings.length ? Math.round(readings.reduce((s, r) => s + r.healthScore, 0) / readings.length) : '—'}
            </div>
          </div>
        </div>
      )}

      <div className="analytics-charts">
        <div className="card chart-card">
          <h3 className="chart-title">💧 Soil Moisture Over Time</h3>
          {readings.length > 0 ? <SensorChart readings={readings} type="moisture" /> : <p className="no-data">No data available</p>}
        </div>
        <div className="card chart-card">
          <h3 className="chart-title">🌡️ Temperature Over Time</h3>
          {readings.length > 0 ? <SensorChart readings={readings} type="temperature" /> : <p className="no-data">No data available</p>}
        </div>
      </div>
    </div>
  )
}
