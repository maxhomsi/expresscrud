let db = require("../model/db.js"); //requista o db.js para ser ativado


// function to returns a summary of the items on the response
let itemsSummary = function(req, res){
    console.log("itemsSummary");

    let sql = "select id, task, is_done from todos"; //informando o que sql dos todos do DB

    db.query(sql, function(err, results){ //para conectar com o database. sql que eh a funcao que quero e a funcao para mostar o erro
        if(err){
            console.log("could not execute the query", err); //se tiver o erro, envia a respota
            res.sendStatus(400);
        } else {
            // for the is_done column, the databse returns 1, 0 or null.
            // but we want to surface that as true or false
            for(let i=0; i < results.length; i++){ // faz o loop pelo resultdo  Se o resultado for done, se nao tiver done ele eh false
                let result = results[i];
                if(result.is_done){
                    result.is_done = true;
                } else {
                    result.is_done = false;
                }
            }
            
            res.json(results);  //enviar para o usuario o resultado




        }
    });
}

// function to return the detail of a single item on the response
//funcao para retorar os detalhes de cada item
let itemDetails = function(req, res){
    console.log("itemDetails");

    let id = req.params.id; //informar o ID para mostrar o sumary do todo

    // when a sql statment uses ?, this called parameterized SQL
    // o ? eh o um curinga que vai virar a resposta do usuario
    let sql = "select id, task, description, is_done from todos where id = ?"; //informa o que eh o SQL
    let params = []; // this array will hold the params for our sql statement
    params.push(id); // this is the first param in the sql statment

    // bad way, susptible to sql injection, please do not do this!!!!!!!!

    //let badSql = "select id, task, description, is_done from todos where id = "+id;

    db.query(sql, params, function(err, results){ //funcao para mostrar o erro para o usuario
        if(err){
            conosole.log("failed to execute query:", err);
            res.sendStatus(500); // it is not the clients fault the query failed
        } else {
            if(results.length == 1){ //so pode ter um resultaro por ID, que eh unico
                // for the is_done column, swap out 0,1 or null for 
                // true or false
                let result = results[0];
                if(result.is_done){
                    result.is_done = true;
                } else {
                    result.is_done = false;   
                }
                res.json(result);
            } else if (results.length > 1) {
                console.log("Found more that one result for id ", id);
                res.sendStatus(500); // we send a 500 because this is a server bug, no the clients fault
            } else {
                // if the result's length is 0, so we send a 404 (not found)
                res.sendStatus(404);
            }

        }
    })
}

/*
    {
        "task": "adsadada"   -- this cannot be empty
        "description": "asdadad"
    }
*/

// function to create a new item
let createItem = function(req, res){ //sempre a mesma coisa, req e res
    console.log("createItem");

    let input = req.body; //input do body no postman
    let task = input.task; //eh a funcao que o usuario vai fazer
    let description = input.description; //aqui eh o input da descricao

    if(!task){
        res.status(400).send("task is required");
        return;
    }

    // we are using parameterized sql again, to avoid sql injection
    // we should always use parameterized sql when accepting input from the client
    // and using it in the sql statement. Becuase we DO NOT TRUST THE CLIENT

    let sql = "insert into todos(task, description) values (?, ?)"; //informa onde vai ser inseriodo
    let params = [task, description];

    db.query(sql, params, function(err, results){ //informando os erros
        if(err){
            console.log("Could not execute sql insert", err);
            res.sendStatus(500);
        } else {
            res.sendStatus(204); // we do not have anything to return, but we want to let the client know that everything went ok
        }
    } );

    
}

/* 

{
    "task": "asddasdasdasdad"  -- required
    "description": "  asldkajsdlajdlajsdlad"
    "is_done": true / false
}


*/

// function to update an item
let updateItem = function(req, res){
    console.log("updateItem");

    // get the id from the path parameter
    let id = req.params.id; //informa o que eh o id
    let body = req.body; 

    let task = body.task;
    let description = body.description;
    let isDone = body.is_done;

    // make sure task is set in the body
    if(!task){ //se nao tiver a task, aparece o erro
        res.status(400).send("task is required");
        return;
    }
    
    // force the client to send true or false for the is_done attribute
    if(isDone != true && isDone != false){ //se nao tiver nem true nem false ele ta informando o erro
        res.status(400).send("is_done must be either true or false");
        return;
    }

    let isDoneInt;
    if(isDone == true){
        isDoneInt = 1;
    } else {
        isDoneInt = 0;
    }

    let sql = "update todos  set task = ?, description = ?, is_done = ? where id = ? ";
    let params = [task, description, isDoneInt, id];

    db.query(sql, params, function(err, results){
        if(err){
            console.log("could not execute update sql", err);
            res.sendStatus(500); //this is not the clients fault
        } else {
            res.sendStatus(204); // no data to send back, but we want to let the client know that everything went ok   
        }
    });

}

// function to delete an item
let deleteItem = function(req, res){
    console.log("deleteItem");
    
    let id =req.params.id; //vai informar a id do item q quer deletar

    // introduced a bad sql command bug
    let sql = "delete from todos where id = ?";
    let params = [id];

    db.query(sql, params, function(err, results){
        if(err){ //informar o erro
            console.log("Failed to delete item with id"+id, err);
            res.sendStatus(500);
        } else { //se nao manda o status certo
            res.sendStatus(204); // nothing to send back, but the ok status
        }
    })


}
//esta exportando tudo para ser utilizado
module.exports = {
    itemDetails, itemsSummary, createItem, updateItem, deleteItem
}