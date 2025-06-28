const jwt = require('jsonwebtoken')

const adminMiddleWare = async(req,res,next) => {
    try {
        if(req.user.role !== 'admin'){
            return res.status(403).json({
                success : false,
                message : 'Access denide ! Admin Rights required'
            })
        }

        next();
    } catch (error) {
        
    }
}

module.exports = adminMiddleWare;