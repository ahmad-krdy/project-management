const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin', 'manager', 'employee'],
        default:'employee'
    }
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);