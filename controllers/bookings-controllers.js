const Dates = require("../models/dates")
const startFN = require("./puppeteer-start-fn")
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')


const getBookings = asyncWrapper( async (req, res) => {
        const { id: dateID, nights, private } = req.params
        const dates = await Dates.findOne({ _id: dateID })
        if (!dates) {
            return next(createCustomError(`No date with id ${dateID} found`, 404))
        }
        const allHotels = await startFN(dates, nights, private)
        res.status(200).json({ success: true, data: allHotels })
})

module.exports = { getBookings }
