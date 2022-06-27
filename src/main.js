//primeiramente instalar o express depois de criar o package.json 
//a variavel "express" solicita para que use o express
const express = require("express");
const bodyParser = require("body-parser"); //para poder usar o body
let dotenv = require("dotenv");
dotenv.config();



// get the app servers port from env, fallback on port 8000 if not configured
const PORT = process.env.PORT || 8000; 

//informando que o app eh o express
let app = express();

app.use(bodyParser.json())


app.use(express.static("./static"));

// get the route defintions
const todoRoutes = require("./routes/todosRoutes"); //chama para poder usar
// tell the express app to use the routes
app.use(todoRoutes);


// start the express app and log what port i am on
// so para informar de quando o port for ativado ele vai mostrar a porta
app.listen(PORT, function(){
    console.log("Api Server started on port ", PORT);
});

