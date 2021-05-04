const express =require('express');
const router = express.Router();
const authController = require('../Controllers/auth');
const db = require('../Controllers/database')

router.get('/items' , async (req,res)=>{
    db.queryItemsUserId(req.body.id,(err,resu)=>{
        if(err) return res.status(500).json({"status": "error" , "message": err.code});
        res.status(201).send(resu);
    })
})


router.post('/items', async (req,res)=>{
    let{name , category_id, image,note}= req.body;
    if ( !((name) && (category_id) && (image) && (note))) return res.status(500).json({"stataus": "error" , "message": "INVALID_REQUEST_FORMAT"})
 
    db.insertItem(req.body, (err,resu)=>{
        console.log(err);
        if(err) return res.status(500).json({"stataus": "error" , "message": err.code});
        res.send(resu);
    })
})


router.put ('/items/:item_id', async (req,res)=>{
    req.body.item_id = req.params.item_id
    db.modifyItem(req.body,(err,resu)=>{
        if(err) return res.status(500).json({"status": "error" , "message": err.code});
        res.status(201).json({"status": "succesful"});
    })
})







module.exports = router;