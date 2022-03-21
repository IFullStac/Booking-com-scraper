const Dates = require('../models/dates')

const getFullMoonDates = async (req, res) => {
    try {
        const dates = await Dates.find({})
        res.status(200).json({success: true, data: dates })
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const createDate = async (req, res) => {
    try {
        const dates = await Dates.create(req.body)
        res.status(201).json({dates})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const selectDate =async (req, res) => {
    try {
        const { id:dateID } = req.params
        const dates = await Dates.findOne({_id:dateID})
        if(!dates){
            return res.status(404).json({msg:`No date with id ${dateID} found`})
        }
        res.status(200).json({dates})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

const deleteDate = async (req, res) => {
    try {
        const {id:dateID} = req.params
        const date = await Dates.findOneAndDelete({_id:dateID})
        if(!date) {
            return res.status(404).json({msg: `No date with id: ${dateID} found`})
        }
        res.status(200).json({date})
    } catch (error) {
        res.status(500).json({msg: error})
    }
}

module.exports = {getFullMoonDates, deleteDate, createDate , selectDate} 
