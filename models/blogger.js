const mongoose = require('mongoose');

const BloggerSchema = mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  username : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  }
});
const Blogger = module.exports = mongoose.model('Blogger', BloggerSchema);
