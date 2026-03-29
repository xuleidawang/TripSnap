import express from 'express'
import cors    from 'cors'
import analyzePhoto from './analyze-photo.js'
import generatePlan from './generate-plan.js'

const app  = express()
const PORT = 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.post('/api/analyze-photo', analyzePhoto)
app.post('/api/generate-plan', generatePlan)

app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`))
