const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const authMiddleware = async (req,res,next)=>{
    try {
        const authHeader = req.headers.Authorization || req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            throw new Error("Authentication required!");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY);
        const userData = await User.findById(decoded.user_id).select("_id firstname lastname email role");
        if(!userData) throw new Error("User not found!");
        req.user = userData;
        next();
    } catch (error) {
        res.status(500).json({status:"error",message:error.message});
    }
}

module.exports = authMiddleware;