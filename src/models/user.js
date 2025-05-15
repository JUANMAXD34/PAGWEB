const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
    email: String,
    password: String, 
    username: {type: String, default:null},
    addiction: {type:String, default:null}, 
    fecha_inicio: {type:Date, default:null},
    token: {type:String , default:null}  
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.validarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", userSchema);