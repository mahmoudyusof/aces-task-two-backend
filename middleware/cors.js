module.exports = async function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "x-auth-token, Content-Type");
    res.header("Access-Control-Expose-Headers", "x-auth-token, Content-Type");
    next();
}