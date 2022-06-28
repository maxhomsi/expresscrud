const express = require("express"); //usa o express
let router = new express.Router() //informa que o router
let controller = require("../controllers/todosCtrl"); //utilizar para usar o controllers
let auth = require("../middleware/auth") //chamar para usar a autentificacao
//informar o que vai ser ativado e onde eh


// get summary of items

router.get("/todos", controller.itemsSummary);

// get detail of a single item, given its id
router.get("/todos/:id", auth.verifyJWT, controller.itemDetails); 
//coloquei o comando auth.verify para chamar o prompt de usario e senha

// create a new item
router.post("/todos", controller.createItem);

// update an item, given its id
router.put("/todos/:id", controller.updateItem);

// delete an item, given its id
router.delete("/todos/:id", controller.deleteItem);

module.exports = router; //exportando tudo para todos usar
 //nao pode estar em obbjecto se for so 1