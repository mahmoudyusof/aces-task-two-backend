module.exports = async function(req, res, next){
    if(!req.user || req.user.role !== "admin") return res.status(401).send("Access denied!");
    next();
}