 const port = process.env.PORT || 8000
const connectDB = require('./db/connect')
require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const mainRouter = require('./Routes/main')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


const bookings = require('./Routes/bookings-routes')
const dates = require('./Routes/fullmoonDates-routes')
// static asstets
app.use(express.static('./public'))

// parse form data
// app.use(express.urlencoded({ extended: false }))

// parse json
app.use(express.json())

app.use('/api/dates', dates)
app.use('/api/bookings', bookings)

app.use('/api', mainRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log('Server is listening on port 8000....'))
  } catch (error) {
    console.log(error)
  }
}  

start()