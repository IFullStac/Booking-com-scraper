const express = require('express')
const router = express.Router()

const { getBookings} = require('../controllers/bookings-controllers')

router.get('/:id/:nights/:private', getBookings)

module.exports = router