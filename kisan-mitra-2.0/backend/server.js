require('dotenv').config()
setInterval(() => {}, 60000); // Keep event loop alive for local mock mode
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')
const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'kisan-mitra-backend' }))
app.use('/api/v1', routes)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB();
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    console.log(`Starting backend in MOCK MODE...`);
  }
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
};

startServer();