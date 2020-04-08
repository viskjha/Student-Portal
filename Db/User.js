const mongoose = require('mongoose');

const users = new mongoose.Schema({
    
     name:{
        type:String
     },
	email:{
        type:String
     },
     regesterno:{
         type:String
     },
    password:{
        type:String
    }
    
});

module.exports = User = mongoose.model('users',users);