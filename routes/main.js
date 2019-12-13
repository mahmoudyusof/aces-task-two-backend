const router = require("express").Router();
const admin = require("../middleware/admin");
const { User } = require("../models/User");

router.get('/admin/only', admin, async (req, res) =>{
    try{
        console.log(req.user);
        const users = await User.find().select(['name', 'email', 'role', '-_id']);
        res.send(users);
    }catch(e){
        return res.status(400).send(e.message);
    }
});

router.get('/auth/only', (req, res) => {
    res.send(`Hello, ${req.user.name} @ <${req.user.email}>`);
});

module.exports = router;