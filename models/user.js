const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//schema
const userSchema = new Schema({
name : {type: String},
userName : { type : String},
password : { type : String},
role : {type : String}
});



module.exports = mongoose.model('User',userSchema);
