const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token) {
        return res.status(401).json({error: "Access denied no token"})
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({message: "token not working"})
    }
}

const verifyAdmin = (req, res, next) => {
    if(req.user.role !== "ADMIN") {
        return res.status(403).json({message: "Access denied, admin only"})
    }
    next();
}

module.exports = { verifyToken, verifyAdmin}