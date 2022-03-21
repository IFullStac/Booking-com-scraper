const port = process.env.PORT || 8000
const connectDB = require('./db/connect')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

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


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log('Server is listening on port 8000....'))
  } catch (error) {
    console.log(error)
  }
}  

start()