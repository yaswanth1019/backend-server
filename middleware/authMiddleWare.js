const jwt = require('jsonwebtoken')

const authMiddleWare = async(req,res,next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message : 'Access denied. Please login again',
                error : true
            });
        }
        const token = authHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({
                message : 'Access denied. Please login again',
                error : true
            });
        }
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decode.payload;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token. Please login again',
            error: true
        });
    }
}

module.exports = authMiddleWare