

const express = require ('express')
const app = express()
const bodyparser = require('body-parser');
const expressValidator = require ('express-validator');
const authController = require ('./Controllers/auth')


//Body access
app.use (express.urlencoded({extended: false}))
app.use(express.json());


//Define Routes 
app.use('/auth',require('./routes/auth.js'));
app.use('/lists',require('./routes/lists.js'));


app.get('/test',(req,res)=>{  
    console.log('attempt request');
    res.send('a');
})







app.listen(process.env.PORT);