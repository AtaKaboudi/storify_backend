const mysql = require('mysql');
const bcrypt = require('bcrypt')
require('dotenv').config({})

//connect to database 
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

})

db.connect((err) => {
    const prompt = err ? "[DB] " + err.code : "MYSQL Connected"
    console.log(prompt);
})


function queryUserEmail(email, callback) {
    db.query("SELECT * FROM " + process.env.DATABASE_USER_TABLE + " WHERE email =  ?", [email], async (err, resu) => {
        callback(err, resu);
    })
}

function queryUserId(id, callback) {
    db.query("SELECT * FROM " + process.env.DATABASE_USER_TABLE + " WHERE id =  ?", [id], async (err, resu) => {
        callback(err, resu);
    })
}

function insertUser(user, callback) {
    db.query('INSERT into ' + process.env.DATABASE_USER_TABLE + ' SET ?', {
        user_name: user.user_name,
        email: user.email,
        password: bcrypt.hashSync(user.password, 12),

    }, (err, resu) => {
        callback(err, resu);
    })
}

function querylistsUserId(user_id, callback) {
    db.query("SELECT * FROM " + process.env.DATABASE_LISTS_TABLE + " WHERE user_id =  ?", [user_id], async (err, resu) => {
        callback(err, resu);
    })
}
function insertList(list, callback) {
    let listObject = {
        name: list.name,
        user_id: list.user_id,
        created_at: getCurrentDate(),
        updated_at: getCurrentDate()
    }
    db.query('INSERT into ' + process.env.DATABASE_LISTS_TABLE + ' SET ?', [listObject], (err) => {
        db.query('SELECT * FROM  ' + process.env.DATABASE_LISTS_TABLE + ' Where user_id = ? AND name = ?', [list.user_id, list.name], (erro, resu) => {
            callback(err, resu);
        })
    })

}
function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

function modifyList(params, callback) {
    db.query('UPDATE ' + process.env.DATABASE_LISTS_TABLE + ' SET name = ? WHERE id = ? AND user_id = ? ', [params.name, params.list_id, params.user_id], (err, resu) => {
        callback(err, resu);
    })
}

function deleteList(params, callback) {
    db.query('DELETE FROM ' + process.env.DATABASE_LISTS_TABLE + ' WHERE id = ? AND user_id', [params.list_id, params.user_id], (err, resu) => {
        callback(err, resu);
    })
}
function queryItemsUserId(user_id, callback) {
    db.query('SELECT * FROM ' + process.env.DATABASE_ITEMS_TABLE + ' WHERE user_id = ? ', [user_id], (err, resu) => {
        callback(err, resu);
    })
}
function getHistory(user_id, callback) {
    db.query('SELECT *, list.name as list_name, list.created_at as list_created_at, list.updated_at as list_updated_at FROM ' + process.env.DATABASE_LISTS_TABLE + '  JOIN '
        + process.env.DATABASE_ITEMS_TABLE + ' ON item.list_id = list.id  WHERE item.user_id = ?', [user_id], (err, resu) => {
            callback(err, resu);
        })
}

function querySuggestions(callback) {
    db.query('SELECT item.* , category.name as category, item.name as label FROM category INNER JOIN  item ON category.id = item.category_id WHERE item.user_id = 1', (err, resu) => {
        console.log(err);
        callback(err, resu);
    })
}
function insertItem(params, callback) {
    let itemObject = {
        name: params.name,
        user_id: params.id,
        image: params.image,
        note: params.note,
        category_id: params.category_id,
        list_id: params.list_id,
        created_at: getCurrentDate(),
        updated_at: getCurrentDate()
    }
    db.query('INSERT into ' + process.env.DATABASE_ITEMS_TABLE + ' SET ?', [itemObject], (err, resu) => {
        callback(err, itemObject);
    })
}

function modifyItem(params, callback) {
    db.query('UPDATE ' + process.env.DATABASE_ITEMS_TABLE + ' SET name = ? , image = ? , category_id = ? , note = ? , updated_at = ? WHERE id = ?  ', [params.name, params.image, params.category_id, params.note, getCurrentDate(), params.item_id], (err, resu) => {
        callback(err, resu);
    })
}

function queryCategories(user_id, callback) {
    db.query('SELECT * FROM ' + process.env.DATABASE_CATEGORIES_TABLE + ' WHERE user_id = ? ', [user_id], (err, resu) => {
        callback(err, resu);
    })
}

function insertCategory(params, callback) {
    let categoryObject = {
        name: params.name,
        user_id: params.id,
        created_at: getCurrentDate(),
        updated_at: getCurrentDate()
    }
    db.query('INSERT into ' + process.env.DATABASE_CATEGORIES_TABLE + ' SET ?', [categoryObject], (err, resu) => {
        callback(err, categoryObject);
    })

}

function updateCategory(params, callback) {
    db.query('UPDATE ' + process.env.DATABASE_CATEGORIES_TABLE + ' SET name = ? ,  updated_at = ?  WHERE id = ?  ', [params.name, getCurrentDate(), params.category_id], (err, resu) => {
        callback(err, resu);
    })
}

function deleteCategory(category_id, callback) {
    db.query('DELETE FROM ' + process.env.DATABASE_CATEGORIES_TABLE + ' WHERE id = ? ', [category_id,], (err, resu) => {
        callback(err, resu);
    })
}


function queryItemsByForeignKeys(params, callback) {
    db.query('SELECT * FROM ' + process.env.DATABASE_ITEMS_TABLE + ' WHERE user_id = ? AND list_id = ? ', [params.id, params.list_id], (err, resu) => {
        callback(err, resu);
    })
}


function modifyItemsByList(params, callback) {
    db.query('UPDATE ' + process.env.DATABASE_ITEMS_TABLE + ' SET list_id = ?  WHERE id = ?  ', [params.list_id, params.item_id], (err, resu) => {
        callback(err, resu);
    })
}

function updateFullItem(params, callback) {
    db.query('UPDATE ' + process.env.DATABASE_ITEMS_TABLE + ' SET list_id = ? , name = ? , image = ? , category_id = ? , note = ? , updated_at = ?  WHERE id = ?  ', [params.list_id, params.name, params.image, params.category_id, params.note, getCurrentDate(), params.item_id], (err, resu) => {
        callback(err, resu);
    })
}
function deleteItem(item_id, callback) {
    db.query('DELETE FROM ' + process.env.DATABASE_ITEMS_TABLE + ' WHERE id = ? ', [item_id], (err, resu) => {
        callback(err, resu);
    })
}

module.exports = {
    deleteItem,
    updateFullItem,
    modifyItemsByList,
    queryItemsByForeignKeys,
    deleteCategory,
    updateCategory,
    insertCategory,
    queryCategories,
    modifyItem,
    insertItem,
    queryItemsUserId,
    deleteList,
    modifyList,
    queryUserEmail,
    insertUser,
    queryUserId,
    querylistsUserId,
    insertList,
    querySuggestions,
    getHistory
}
