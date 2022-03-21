const mongoose = require('mongoose')

const DatesSchema = new mongoose.Schema( {
    year: {
        type:Number,
        max: [2030, 'can select up to 2030'],
        // max: [2021, 'cant select in the past'],
        required:[true, 'must provide date']
    },
    month: {
        type:Number,
        max: [12, 'there are only 12 months'],
        // min: [1, 'min is 1'],
        required:[true, 'must provide date']
    },
    day: {
        type:Number,
        max: [31, 'max days is 31'],
        // min:[1, 'min is 1'],
        required:[true, 'must provide date']
    }

})


module.exports = mongoose.model('Dates', DatesSchema)