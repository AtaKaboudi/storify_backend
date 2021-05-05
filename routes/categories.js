const express = require('express');
const router = express.Router ();
const authController = require('../Controllers/auth');
const db = require('../Controllers/database');
const{ErrorHandler} = require('../Controllers/error')

router.get('/categories', async (req,res,next)=>{
    db.queryCategories(req.body.id,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).send(resu);
    })
})
router.post ('/categories', async(req,res,next)=>{
    db.insertCategory(req.body,(err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
         res.status(201).send(resu);
    })
})

router.put('/categories/:category_id',(req,res,next)=>{
    if(!req.body.name) return res.status(422).send({"status": "error","message": "WRONG_REQUEST_FORMAT"})
    req.body.category_id = req.params.category_id;
    db.updateCategory(req.body , (err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(201).send({"status" : "successful"});
    })
})

router.delete('/categories/:category_id' ,(req,res,next)=>{
    db.deleteCategory(req.params.category_id, (err,resu)=>{
        if (err) next(new ErrorHandler(500,"Internal Server Error"));
        res.status(200).send({"status" : "successful"});
    })
})




module.exports = router;