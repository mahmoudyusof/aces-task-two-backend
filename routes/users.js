const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, userError } = require("../models/User");
const config = require("config");
const _ = require("lodash");

router.post('/register', async (req, res) => {
    const err = userError(req.body);
    if(err) return res.status(400).send(err);

    try{
        let user = await User.findOne({email: req.body.email});
        if(user) return res.status(400).send(`User with email '${req.body.email}' already exists`);
        user = new User(_.pick(req.body, ['name', 'email']));
        const salt = await bcrypt.genSalt(10);
        const crypted = await bcrypt.hash(req.body.password, salt);
        user.password = crypted;
        user = await user.save();
        const token = await user.generateAuthToken();
        res.header("x-auth-token", token).send("Signed up successfully!");
    }catch(e){
        let msg = "Something went wrong. Please try again later";
        if(config.get("DEBUG")) msg = e.message;
        return res.status(500).send(msg);
    }
});



router.post('/login', async (req, res) => {
    const err = userError(req.body, true);
    if(err) return res.status(400).send(err);

    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send("Invalid username or password!");
    
        const authenticated = await bcrypt.compare(req.body.password, user.password);
        if(!authenticated) return res.status(400).send("Invalid username or password");
    
        const token = await user.generateAuthToken();
        res.header('x-auth-token', token).send("Logged successfully");
    }catch(e){
        let msg = "Something went wrong. Please try again later";
        if(config.get("DEBUG")) msg = e.message;

        return res.status(500).send(msg);
    }
});

module.exports = router;