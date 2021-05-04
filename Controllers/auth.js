
require('dotenv').config({path: "./.env"})
const jwt = require ('jsonwebtoken')






    //TOKEN VERIF
function authentificateToken (req,res,next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null )  return res.status(400).json({"status": "error", "message":" unauthorized"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err)  return res.status(403).json({"status": "error", "message": "Unauthorized"});
        req.body.id = decoded.id;
    })
    next();
}




module.exports = {
    authentificateToken,
}