
const express =require ('express')
const router = express.Router() 
const mysql = require('mysql')
const jwt = require ('jsonwebtoken')
const authController = require('../controllers/auth.js')
const {check ,validationResult} = require ('express-validator/check')
const bcrypt = require('bcrypt')
const db = require ('../Controllers/database');




router.post('/register',[check('email').isEmail()],  async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({'status' : 'Failed' , 'error': "INVALID_EMAIL_TYPE"})
        return;
    }

    await db.queryUserEmail(req.body.email, async(err,resu)=>{
        if(err) return res.send({'status': 'failed', 'error' : err.code})
        if(resu.length == 1 )return res.status(422).send({'status': 'Failed', 'error': "EMAIL_ALREADY_TAKEN" });  

        await db.insertUser({
         email: req.body.email,
         password: req.body.password,
         user_name : req.body.user_name,
         },(err,resu)=>{
            if(err) return res.status(422).send({'status': 'failed', 'error' : err.code})
            res.status(201).send({'status': 'Success'})
          })
    });


    

})







router.post('/login',[check('email').isEmail()], async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({'error': "INVALID_EMAIL_TYPE"})
        return;
    }


        let {email , password}= req.body ;
    

       await  db.queryUserEmail(email, (err, resu)=>{
            if(err) return res.status(500).json({"status" : "failed", "error": err.code});
            if(!resu) return res.status(422).json({"status" : "failed", "error": "INVALID_EMAIL_ADDRESS"});
            if(!bcrypt.compareSync( password,resu[0].password)) {
                console.log(resu);
                res.status(401).json({"status" : "failed","error":"PASSWORD_NOT_FOUND"})
                return;
            }
            const accessToken =  jwt.sign({ id :  resu[0].id} , process.env.ACCESS_TOKEN_SECRET)
            res.json({"user": resu , "accessToken" : accessToken});

        })
})

router.get ('/getUser', async (req,res)=>{
   await authController.authentificateToken(req,res);
    await db.queryUserId(req.body.id, (err,resu)=>{
        if(err) return res.status(500).json({"status": "error", "message": err.code})
        res.send(resu);
    })  
})




module.exports  = router ;


