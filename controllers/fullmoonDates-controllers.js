const Dates = require('../models/dates')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom-error')


const getFullMoonDates = asyncWrapper( async (req, res) => {
    const dates = await Dates.find({})
    res.status(200).json({success: true, data: dates }) 
}
)

const createDate = asyncWrapper( async (req, res) => {
    const dates = await Dates.create(req.body)
    res.status(201).json({dates})
   
})

const selectDate = asyncWrapper( async (req, res) => {
    const { id:dateID } = req.params
    const dates = await Dates.findOne({_id:dateID})
    if(!dates){
        return next(createCustomError(`No date with id ${dateID} found`, 404))
        
    }
    res.status(200).json({dates})
})

const deleteDate = asyncWrapper( async (req, res) => {
        const {id:dateID} = req.params
        const date = await Dates.findOneAndDelete({_id:dateID})
        if(!date) {
            return next(createCustomError(`No date with id ${dateID} found`, 404))
        }
        res.status(200).json({date})
    
} )

module.exports = {getFullMoonDates, deleteDate, createDate , selectDate} 
