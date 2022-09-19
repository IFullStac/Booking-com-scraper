const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom-error') 

const login = async (req, res) => {
    const {username, password} = req.body
    if(!username || !password) {
        throw new CustomAPIError('please provide email and password', 400)
    }
    const id = new Date().getDate()
    const token = jwt.sign({username, id})

    res.send('fake Login, register, signup route')
}

const dashboard = async (req,res) => {
    const luckyNumber = Math.floor(Math.random()*100)
    res.status(200).json({msg: 'Hello JD', secret: `your lucky number ${luckyNumber}`})
}

module.exports = {login, dashboard}