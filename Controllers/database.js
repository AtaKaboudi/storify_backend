const mysql = require ('mysql');
const bcrypt = require('bcrypt')
//connect to database 
const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD ,
    database : process.env.DATABASE_NAME,     

})

db.connect((err)=>{
    const prompt = err ? err.code : "MYSQL Connected"
    console.log(prompt);
})


function  queryUserEmail(email,callback){
     db.query("SELECT * FROM "+ process.env.DATABASE_USER_TABLE+" WHERE email =  ?" ,[email], async (err,resu)=>{
        callback(err,resu);
    })
}
function queryUserId(id,callback){
    db.query("SELECT * FROM "+ process.env.DATABASE_USER_TABLE+" WHERE id =  ?" ,[id], async (err,resu)=>{
        callback(err,resu);
    })
}

function insertUser(user,callback){
     db.query('INSERT into '+process.env.DATABASE_USER_TABLE+' SET ?', {
            user_name : user.user_name ,
            email : user.email , 
            password :  bcrypt.hashSync(user.password,12) ,                                   
         
    },(err,resu)=>{
       callback(err,resu);
    })
}

function querylistsUserId(user_id,callback){
    db.query("SELECT * FROM "+ process.env.DATABASE_LISTS_TABLE+" WHERE user_id =  ?" ,[user_id], async (err,resu)=>{
        callback(err,resu);
    })
}
function insertList (list,callback){
    let listObject =  {      
            name : list.name ,
            user_id : list.user_id,
            created_at : getCurrentDate(),
            updated_at : getCurrentDate()                     
    }
    db.query('INSERT into '+process.env.DATABASE_LISTS_TABLE+' SET ?',[listObject], (err,resu)=>{
   callback(err,listObject);
})

}
function getCurrentDate (){
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
return today;
}

function modifyList(params, callback){
    db.query('UPDATE '+ process.env.DATABASE_LISTS_TABLE+ ' SET name = ? WHERE id = ? AND user_id = ? ', [params.name,params.list_id,params.user_id], (err,resu)=>{
        callback(err,resu);
    })  
}

function deleteList(params,callback){
    db.query('DELETE FROM '+ process.env.DATABASE_LISTS_TABLE+ ' WHERE id = ? AND user_id', [params.list_id,params.user_id], (err,resu)=>{
        callback(err,resu);
    }) 
}

module.exports ={
    deleteList,
modifyList,
 queryUserEmail,
 insertUser,
 queryUserId,
 querylistsUserId,
 insertList
}
