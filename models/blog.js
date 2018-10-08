let mongoose = require('mongoose');

//Article Schema

let BlogSchema = mongoose.Schema({
  author : {
    type: String,
    required : true
  },
  title : {
    type : String,
    required : true
  },  
  body : {
    type : String,
    required : true
  },
  img : {
    type: String,
    required: false
  }
});

let Blog = module.exports = mongoose.model('Blog', BlogSchema);
