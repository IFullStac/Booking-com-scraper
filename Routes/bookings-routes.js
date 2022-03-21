const express = require('express')
const router = express.Router()

const {getFullMoonDates, createDate, getBookings} = require('../controllers/bookings-controllers')

router.get('/', getFullMoonDates)
router.post('/', createDate)
router.get('/:id', getBookings)

module.exports = router