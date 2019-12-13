const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

module.exports = async function (req, res, next){
    let token = req.header("x-auth-token");
    if(!token) return res.status(401).send("Access denied!");
    try{
        let data = await jwt.verify(token, config.get("PRIVATE_KEY"));
        req.user = _.pick(data, ['name', 'email', 'role']);
        next();
    }catch(e){
        return res.status(400).send("No token found!");
    }
}