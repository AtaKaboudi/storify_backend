const express = require('express');
const router = express.Router ();
const authController = require('../Controllers/auth');
const db = require('../Controllers/database');


router.get('/categories', async (req,res)=>{
    await authController.authentificateToken(req,res);
    db.queryCategories(req.body.id,(err,resu)=>{
        if(err) return res.status(500).json({"stataus": "error" , "message": err.code});
        res.status(201).send(resu);
    })
})




module.exports = router;