

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
app.use('/lists',authController.authentificateToken,require('./routes/lists.js'));
app.use('/items',authController.authentificateToken,require('./routes/items.js'));
app.use('/categories',authController.authentificateToken,require('./routes/categories.js'));









app.listen(process.env.PORT);