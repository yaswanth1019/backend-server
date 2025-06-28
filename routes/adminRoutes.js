const express = require('express');
const authMiddleWare = require('../middleware/authMiddleWare');
const adminMiddleWare = require('../middleware/adminMiddleWare');
const adminRouter = express.Router()

adminRouter.get('/welcome',authMiddleWare,adminMiddleWare,(req,res)=>{
    const userData = req.user;
    res.json({
        message : 'Welcome to admin Page',
        data : userData
    })
})

module.exports = adminRouter;