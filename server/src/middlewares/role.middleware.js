const roleMiddleware = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({ status:'fail',message: 'Access denied: insufficient role' });
        }
        next();
    }
}

module.exports = roleMiddleware;