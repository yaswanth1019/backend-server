const express = require('express')
const { register, login, changePassword } = require('../controller/userAuthController')
const authMiddleWare = require('../middleware/authMiddleWare')
const userRouter = express.Router()


userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.post('/changepassword',authMiddleWare,changePassword);

module.exports = userRouter;