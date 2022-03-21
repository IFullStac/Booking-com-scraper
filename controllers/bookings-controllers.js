const Dates = require('../models/dates')
const startFN = require('./puppeteer-start-fn')

const getBookings = async (req, res) => {
    try {    
        const { id:dateID , nights, private} = req.params
        const dates = await Dates.findOne({_id:dateID})
        if(!dates){
            return res.status(404).json({msg:`No date with id ${dateID} found`})
        }
        const allHotels = await startFN(dates, nights, private)       
        res.status(200).json({success: true, data: allHotels })
    } catch (error) {
        res.status(500).json({message: error})
    }
}

module.exports = { getBookings} 


