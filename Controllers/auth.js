
require('dotenv').config({path: "./.env"})
const jwt = require ('jsonwebtoken')






    //TOKEN VERIF
function authentificateToken (req,res) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null ) return res.sendStatus(40).json({"status": "error", "message":" unauthorized"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err) return res.sendStatus(403).json({"status": "error", "message": "Unothorized"});
        req.body.id = decoded.id;
    })
}




module.exports = {
    authentificateToken,
}