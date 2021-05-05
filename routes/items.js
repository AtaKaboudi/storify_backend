const express =require('express');
const router = express.Router();
const authController = require('../Controllers/auth');
const db = require('../Controllers/database')
const {ErrorHandler} = require('../Controllers/error')
router.get('/items' , async (req,res,next)=>{
    db.queryItemsUserId(req.body.id,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).send(resu);
    })
})


router.post('/items', async (req,res,next)=>{
    let{name , category_id, image,note}= req.body;
    if (!((name) && (category_id) && (image) && (note))) return res.status(500).json({"status": "error" , "message": "INVALID_REQUEST_FORMAT"})
 
    db.insertItem(req.body, (err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.send(resu);
    })
})


router.put ('/items/:item_id', async (req,res,next)=>{
    req.body.item_id = req.params.item_id
    db.modifyItem(req.body,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).json({"status": "succesful"});
    })
})







module.exports = router;