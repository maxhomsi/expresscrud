let jwt = require("jsonwebtoken")
//pega o token do usuario e separa a informacao necessaria
let verifyJWT = function(req, res, next){
    let header = req.get("Authorization")
    let signedToken;
    if(header){
        let parts = header.split(" ");
        signedToken = parts[1]
    }
    if(signedToken){
        try {
            let token = jwt.verify(signedToken, process.env.JWT_SECRET);
            next();
    
        } catch(err){
            res.sendStatus(400);
            
        }

    }else{
        res.sendStatus(400);

    }
}

module.exports = {
    verifyJWT
}