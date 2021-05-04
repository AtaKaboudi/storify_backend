const express = require('express');
const router = express.Router();
const db = require('../Controllers/database')
const authController = require ('../Controllers/auth');
const { Router } = require('express');

router.get ('/lists', async(req,res)=>{
    await db.querylistsUserId(req.body.id, (err,resu)=>{
        if(err) return res.status(500).json({"status": "error","message":err.code})
        res.status(201).send(resu);
    })
})

router.post('/lists',async (req,res)=>{

    if(!req.body.name) return res.status(422).json({"status": "error","message": "INVALID_NAME_FORMAT"})
    db.insertList({
        name : req.body.name ,
        user_id : req.body.id ,
    }, (err,resu)=>{
        if(err) res.status(500).json({"status": "error" ,"error": err.code})
        res.send(resu);
    })

})

router.put('/lists/:list_id', async (req,res)=>{
    if( !req.body.name && !req.params.list_id) return res.status(422).json({"status": "failed","error": "WRONG_REQUEST_FORMAT"})
    let object = {
        user_id : req.body.id,
        list_id : req.params.list_id,
        name : req.body.name,
    }

    db.modifyList(object,(err,resu)=>{
        if(err) return res.status(500).json({"status": "error","message": err.code});
         return res.status(200).json({"status": "Successful"})
    })
})

router.delete('/lists/:list_id',async(req,res)=>{
    db.deleteList({ list_id : req.params.list_id, user_id : req.body.id} , (err,resu)=>{
        if(err) return res.status(500).json({"status": "error","message": err.code});
        res.status(200);
    })
})


router.get('/lists/:list_id/items',(req,res)=>{
    req.body.list_id = req.params.list_id;
    db.queryItemsByForeignKeys(req.body,(err,resu)=>{
        if(err) return res.status(500).json({"status": "error" , "message": err.code});
        res.status(201).json(resu);
    })
})

router.post('/lists/:list_id/items',(req,res)=>{
    if(!(req.body.item_id) || !(req.body.list_id)) return res.status(422).json({"status": "failed","error": "WRONG_REQUEST_FORMAT"})
    db.modifyItemsByList(req.body,(err,resu)=>{
        if(err) return res.status(500).json({"status": "error" , "message": err.code});
        res.status(201).json({"status" : "succesful"});
    })
})


router.put('/lists/:list_id/items',(req,res)=>{

    db.updateFullItem(req.body,(err,resu)=>{
        if(err) return res.status(500).json({"status": "error" , "message": err.code});
        res.status(201).json({"status" : "succesful"}); 
    })
})

router.delete('/items/:item_id',(req,res)=>{
    db.deleteItem(req.params.item_id,(err,resu)=>{
        if(err) return res.status(500).json({"status": "error" , "message": err.code});
        res.status(201).json({"status" : "succesful"}); 
    })
})



module.exports = router ;