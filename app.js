const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const bookings = require('./Routes/bookings-routes')

// static asstets
app.use(express.static('./public'))

// parse form data
// app.use(express.urlencoded({ extended: false }))

// parse json
app.use(express.json())

app.use('/api/bookings', bookings)

app.listen(8000, () => {
    console.log('Server is listening on port 8000....')
  })