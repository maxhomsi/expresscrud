let mysql = require("mysql");  //instalar o mysql e chamar ele para ser utilizado
//instalar o dot env

let connection = mysql.createConnection({  //"createConnection" cria uma funcao que recebe um objeto. Utiliza a funcao
//usar o padrao abaixo e seguir  o padrao

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
    
});

connection.connect(); //criou uma funcao para conectar no servidor, ativando a funcao de cima

//informado no documentation do express
// err deria o erro, caso tenha um erro, logar que teve o erro e apos tem o erro.

//informa se tem um erro 
connection.query("select now()", function(err, results){  
    if(err){
        console.log("Could not test the database connection", err);
    } else {
        console.log("Connection test results: ", results);
    }
}),

module.exports = connection;   //exportou a coneccao para o express utilizar