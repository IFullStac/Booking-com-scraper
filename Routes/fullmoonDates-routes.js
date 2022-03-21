const express = require('express')
const router = express.Router()

const {getFullMoonDates, deleteDate,  createDate, selectDate} = require('../controllers/fullmoonDates-controllers')

router.get('/', getFullMoonDates)
router.post('/', createDate)
router.get('/:id', selectDate)
router.delete('/:id', deleteDate)

module.exports = router