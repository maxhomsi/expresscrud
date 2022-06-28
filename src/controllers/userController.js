let db = require("../model/db.js"); //requista o db.js para ser ativado
let argon = require("argon2")
let jwt = require("jsonwebtoken")

let register = async function(req, res){ //funcao para registrar o usuario
    console.log("register")
    let sql = "insert into users (email, pw_hash) values (?,?)"
    let email = req.body.email
    let password = req.body.password
    let pwHash = await argon.hash(password);

    let params = [email, pwHash]

    db.query(sql, params, function(err, results){
        if(err){
            console.log ("Could not add user", err)
            res.sendStatus(500)

        } else {
            res.sendStatus(204)
        }
    })


}

let login = async function(req, res){ // funcao para criar o login
console.log("login")

let email = req.body.email
let password = req.body.password

let sql = "select pw_hash from users where email = ?";
let params = [email]

db.query(sql, params, async function(err, results){
if(err){
    console.log("cannot get password hash", err)
    res.sendStatus(500)

    return;
}
if(results.length > 1) { //se a pessoa tentar criar um email que ja existe ele da esse erro
console.log("returned more than 1 row for", email)
res.sendStatus(500)
return;

}

if (results.length == 0){ //nenhuma conta registrada com esse email
res.sendStatus(400)
return
}

let hash = results[0].pw_hash //ele pega o hash que foi salvo no DB
let userId = results[0].id
let goodPassword = await argon.verify(hash, password)

let token = {
    "email": email,
    "user_id": userId
};
//se a senha for correta para conseguir acessar
if(goodPassword){
let signedToken = jwt.sign(token, process.env.JWT_SECRET)
res.send(signedToken);
} else {
    res.sendStatus(400);
}

})

}
module.exports ={
    register,
    login
}