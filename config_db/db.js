const mysql = require('mysql');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'', 
    database:'biblio',
    port:3306
})

connection.connect(function(err){
    if(!!err){
        console.log(err);
    }
    else{
        console.log("connected");
    }
})

module.exports = connection;