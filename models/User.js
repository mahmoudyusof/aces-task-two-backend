const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");


const userSchema = new mongoose.Schema({
    name: {type: String, minlength: 3, maxlength: 255, required: true},
    email: {type: String, minlength: 5, maxlength: 1023, required: true, unique: true},
    password: {type: String, minlength: 50, maxlength: 1023, required: true},
    role: {type: String, minlength: 3, maxlength: 255, default: "guest"}
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
    }, config.get("PRIVATE_KEY"));
    return token;
}

const User = mongoose.model("User", userSchema);


function userError(data, login=false){
    const schema = {
        email: Joi.string().min(5).max(1023).required(),
        password: Joi.string().min(8).max(255).required()
    }
    let toValidate;
    if(!login){
        schema.name = Joi.string().min(3).max(255).required();
        toValidate = _.pick(data, ['name', 'email', 'password']);
    }else{
        toValidate = _.pick(data, ['email', 'password']);
    }

    const result = Joi.validate(toValidate, schema);

    if (result.error) return result.error.details[0].message;
    else return false;

}


exports.User = User;
exports.userError = userError;
