const jwt = require('jsonwebtoken')
const { BadRequestError } = require('../errors')

const login = async (req, res)=>{
  const { username, password } = req.body
    // You can use your db connection and logic here

  if (!username || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  //just for demo, normally provided by DB!!!!
  const id = new Date().getDate()

  // try to keep payload small, better experience for user
  // just for demo, in production use long, complex and unguessable string value!!!!!!!!!
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '3m',
  })

  res.status(200).json({ msg: 'user created', token })
}

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100)

  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Access Granted!!! your Secret number is ${luckyNumber}`,
  })
}

module.exports = {
    login,
    dashboard
}