import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createPlant, getPlantTypes } from '../services/api'
import MotionButton from '../components/animations/MotionButton'
import PageTransition from '../components/animations/PageTransition'
import FadeInView from '../components/animations/FadeInView'
import './AddPlant.css'

export default function AddPlant() {
  const navigate = useNavigate()
  const [plantTypes, setPlantTypes] = useState([])
  const [form, setForm] = useState({ name: '', sensorId: '', plantTypeId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { getPlantTypes().then(r => setPlantTypes(r.data)) }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createPlant({ ...form, plantTypeId: parseInt(form.plantTypeId) })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add plant')
    } finally {
      setLoading(false)
    }
  }

  const selectedType = plantTypes.find(t => t.id === parseInt(form.plantTypeId))

  return (
    <PageTransition>
      <div className="add-plant-page">
        <div className="page-header">
          <h1 className="page-title">Add New Plant</h1>
          <MotionButton className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</MotionButton>
        </div>

        <div className="add-plant-layout">
          <FadeInView>
            <div className="card add-plant-form">
              {error && (
                <motion.div className="auth-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {error}
                </motion.div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Plant Name</label>
                  <input id="name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. My Cactus" />
                </div>
                <div className="form-group">
                  <label htmlFor="sensorId">Sensor ID</label>
                  <input id="sensorId" type="text" value={form.sensorId} onChange={e => setForm({ ...form, sensorId: e.target.value })} required placeholder="e.g. ESP32-001" />
                </div>
                <div className="form-group">
                  <label htmlFor="plantTypeId">Plant Type</label>
                  <select id="plantTypeId" value={form.plantTypeId} onChange={e => setForm({ ...form, plantTypeId: e.target.value })} required>
                    <option value="">Select a plant type…</option>
                    {plantTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <MotionButton type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Adding…' : '🌱 Add Plant'}
                </MotionButton>
              </form>
            </div>
          </FadeInView>

          {selectedType && (
            <FadeInView delay={0.1}>
              <div className="card plant-type-info">
                <h3 className="type-info-title">{selectedType.name} Requirements</h3>
                <p className="type-desc">{selectedType.description}</p>
                <div className="type-ranges">
                  <div className="range-item"><span>💧 Moisture</span><span>{selectedType.minMoisture}% – {selectedType.maxMoisture}%</span></div>
                  <div className="range-item"><span>🌡️ Temperature</span><span>{selectedType.minTemperature}°C – {selectedType.maxTemperature}°C</span></div>
                  <div className="range-item critical"><span>⚠️ Critical Moisture</span><span>Below {selectedType.criticalMoistureThreshold}%</span></div>
                </div>
              </div>
            </FadeInView>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default function AddPlant() {
  const navigate = useNavigate()
  const [plantTypes, setPlantTypes] = useState([])
  const [form, setForm] = useState({ name: '', sensorId: '', plantTypeId: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPlantTypes().then(r => setPlantTypes(r.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createPlant({ ...form, plantTypeId: parseInt(form.plantTypeId) })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add plant')
    } finally {
      setLoading(false)
    }
  }

  const selectedType = plantTypes.find(t => t.id === parseInt(form.plantTypeId))

  return (
    <div className="add-plant-page">
      <div className="page-header">
        <h1 className="page-title">Add New Plant</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
      </div>

      <div className="add-plant-layout">
        <div className="card add-plant-form">
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Plant Name</label>
              <input id="name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. My Cactus" />
            </div>
            <div className="form-group">
              <label htmlFor="sensorId">Sensor ID</label>
              <input id="sensorId" type="text" value={form.sensorId} onChange={e => setForm({ ...form, sensorId: e.target.value })} required placeholder="e.g. ESP32-001" />
            </div>
            <div className="form-group">
              <label htmlFor="plantTypeId">Plant Type</label>
              <select id="plantTypeId" value={form.plantTypeId} onChange={e => setForm({ ...form, plantTypeId: e.target.value })} required>
                <option value="">Select a plant type…</option>
                {plantTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Adding…' : '🌱 Add Plant'}
            </button>
          </form>
        </div>

        {selectedType && (
          <div className="card plant-type-info">
            <h3 className="type-info-title">{selectedType.name} Requirements</h3>
            <p className="type-desc">{selectedType.description}</p>
            <div className="type-ranges">
              <div className="range-item">
                <span>💧 Moisture</span>
                <span>{selectedType.minMoisture}% – {selectedType.maxMoisture}%</span>
              </div>
              <div className="range-item">
                <span>🌡️ Temperature</span>
                <span>{selectedType.minTemperature}°C – {selectedType.maxTemperature}°C</span>
              </div>
              <div className="range-item critical">
                <span>⚠️ Critical Moisture</span>
                <span>Below {selectedType.criticalMoistureThreshold}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
