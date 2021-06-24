
require('dotenv').config({ path: "./.env" })
const jwt = require('jsonwebtoken')
const { ErrorHandler } = require('./error')
//TOKEN VERIF
function authentificateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        console.log("[AUTH] " + authHeader)
        next(new ErrorHandler(401, "Unauthorized"));
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ "status": "error", "message": "Unauthorized" });
        req.body.id = decoded.id;
    })
    next();
}




module.exports = {
    authentificateToken,
}