const express = require('express');
const router = express.Router();
const db = require('../Controllers/database')
const authController = require ('../Controllers/auth');
const { Router } = require('express');
const { ErrorHandler } = require('../Controllers/error');

router.get ('/lists', async(req,res,next)=>{
    await db.querylistsUserId(req.body.id, (err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).send(resu);
    })
})

router.post('/lists',async (req,res,next)=>{

    if(!req.body.name)next(new ErrorHandler(500,"INVALID_REQUEST_FORMAT"));
    db.insertList({
        name : req.body.name ,
        user_id : req.body.id ,
    }, (err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.send(resu);
    })

})

router.put('/lists/:list_id', async (req,res,next)=>{
    if( !req.body.name && !req.params.list_id) return res.status(422).json({"status": "failed","error": "WRONG_REQUEST_FORMAT"})
    let object = {
        user_id : req.body.id,
        list_id : req.params.list_id,
        name : req.body.name,
    }

    db.modifyList(object,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
         return res.status(200).json({"status": "Successful"})
    })
})

router.delete('/lists/:list_id',async(req,res,next)=>{
    db.deleteList({ list_id : req.params.list_id, user_id : req.body.id} , (err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(200);
    })
})


router.get('/lists/:list_id/items',(req,res,next)=>{
    req.body.list_id = req.params.list_id;
    db.queryItemsByForeignKeys(req.body,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).json(resu);
    })
})

router.post('/lists/:list_id/items',(req,res,next)=>{
    if(!(req.body.item_id) || !(req.body.list_id)) next(new ErrorHandler(500,"WRONG_REQUEST_FORMAT"));
    db.modifyItemsByList(req.body,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).json({"status" : "succesful"});
    })
})


router.put('/lists/:list_id/items',(req,res,next)=>{

    db.updateFullItem(req.body,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).json({"status" : "succesful"}); 
    })
})

router.delete('/items/:item_id',(req,res,next)=>{
    db.deleteItem(req.params.item_id,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).json({"status" : "succesful"}); 
    })
})



module.exports = router ;