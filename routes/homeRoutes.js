const express = require('express');
const authMiddleWare = require('../middleware/authMiddleWare');
const homeRouter = express.Router()

homeRouter.get('/welcome',authMiddleWare,(req,res)=>{
    const userData = req.user;
    res.json({
        message : 'Welcome to home Page',
        data : userData
    })
})

module.exports = homeRouter;