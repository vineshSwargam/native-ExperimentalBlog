const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const multer = require('multer');
const {check, validationResult } = require('express-validator/check');
//const  expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const path = require("path");
const config = require('./config/database');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
//mongoose.connect('mongodb://loclahost/yourdatabaseName')
mongoose.connect('mongodb://localhost/customer');
let db = mongoose.connection;


//Check Connection
db.once('open', ()=>{
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});

//Init App
const app = express();

//Middleware for body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static('./public'));

//Bring in Models
let Blog = require('./models/blog');
let Blogger = require('./models/blogger');


//Passport config
require('./config/passport')(passport);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

global.userId = '';
app.get('*', (req, res, next) => {
  //res.locals.user = req.user || null;
  if(userId)console.log(userId);
  next();
});



// Server Home for Blogs route
// Get Request
app.get('/blogs', (req, res) => {
  
  let i=0;
  let newBlogs = [], newBlog;
  
  Blog.find()
      .then(blogs => {
        blogs.map(blog => { 
          //console.log(blog.author);      
          Blogger.findById({_id : blog.author}, (err, blogger) => {
            //console.log('This is error');
            if(err) console.log(err);
            else{
              //console.log(blog.title)
              newBlog= { writer : blogger.name, ...blog._doc};
              newBlogs.push(newBlog);
              //console.log(newBlog);
              if(i >= blogs.length-1){
                res.json(newBlogs);
              }
              i++;
            }
          });
        });
        })
      .catch(err => console.log(err));

});

app.get('/bloggers', (req, res) => {
  Blogger.find()
    .then(bloggers => res.json(bloggers))
    .catch(err => res.send(err));
});

app.delete('/blogger/:id', (req, res) => {
  
  Blogger.remove({_id : req.params.id}, err => {
    if(err)console.log(err);
    else{
      res.send(`Blogger  was deleted successfully`);
    }
  });
});

///////////////// I M A G E U P L O A D //////////

// Multer Storage Initiation
const storage = multer.diskStorage({
  destination: './client/src/uploads',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//Checking filetype
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

//Post upload route
app.post('/upload', (req, res) => {
  const errors = [];
  
  upload(req, res, (err) => {
    console.log(` From Index : `);
    //console.log(req.file);
    //res.send(req.file);
    if(err)console.log(err);

    if(req.body.title.length <=3){
      errors.push('Title must be more descriptive');
    }
    if(req.body.body.length <=0){
      errors.push('Body needs more description');
    }
    if(!req.file){
      errors.push('Please select a featured image');
    }
    console.log(req.file);
  if(err){
    console.log(err);
    //errors.push('Image not valid');
  }
    if(errors.length>0 ){
      res.send({status : 400, errors});
    }
    else{
      console.log('Try newblog');
      const newBlog = new Blog({
        author : userId,
        title : req.body.title,
        body : req.body.body
      });
      if(req.file){
        newBlog.img = req.file.filename
      }
      newBlog.save();
      res.send({status : 200, msg : 'Blog published successfully'});
    }
    //.then(blog => res.json(blog));
  });
});


///// U P D A T E   B L O G ////
app.post('/updateblog/:id', (req, res) => {
  const errors = [];
  
  
  upload(req, res, (err) => {
    console.log(` From Update Blog in Index : `);
    console.log(req.file);
    if(err)errors.push(err);
    if(req.body.title.length <=3){
      errors.push('Title must be more descriptive');
    }
    if(req.body.body.length <=0){
      errors.push('Body needs more description');
    }

    if(err)console.log(err);
    
    if(errors.length > 0){
      res.json({status : 400, errors});
    }
    else{
      let updatedBlog = {
        author : userId,
        title : req.body.title,
        body : req.body.body
      }
      if(req.file)updatedBlog.img = req.file.filename;
      /*else{
        Blog.findById({_id: req.params.id}, (err, blog) => {
          if(err)console.log(err);
          updatedBlog.img = blog.img;
        });
      }*/

      console.log(req.params.id)
      Blog.update({_id : req.params.id}, updatedBlog, err => {
        if(err) console.log(err);
        else{
          res.send({status : 200, msg : 'Blog successfully updated'});
        }
      });
    }
  });
})

/////////////////////////////////////

//ViewBlog 
app.get('/viewblog/:id', (req, res) => {
  if(req.params.id !== null){
    Blog.findById({_id : req.params.id}, (err, blog) => {
      if(err) console.log(err);
      else{
        Blogger.findById({_id : blog.author}, (err, blogger) => {
          if(err)console.log(err);
    
          else{
            
            res.json({
              writer : blogger.name,
              ...blog._doc
            });
          }
        });
      }
      
    });
  }
  
})

app.get('/blog/:id', (req, res) => {
  console.log('Single Blog');
  if(req.params.id !== null){
    Blog.findById({_id : req.params.id}, (err, blog) => {
      if(err) console.log(err);
      else{
        res.send(blog);
      }
      
    });
  }
  
})

//Delete blog
app.delete('/deleteblog/:id', (req, res) => {
  
  Blog.remove({_id : req.params.id}, err => {
    if(err)console.log(err);
    else{
      res.send(`Blog  was deleted successfully`);
    }
  });
});







//Server Home for Blogs route
//Post Request
// Tokens P R O C E D U R E
// set token in setToken function in react
// initialize function setToken in App.js
//import function to other places for use
//use verify token by adding it to routes where needed loike this.
// app.post('/blogs', verifyToken, ...anything else)

// POST BLOGS
/*
app.post('/blogs',
        [check('title').isLength({min : 1}).withMessage('Title field is required'),
        check('body').isLength({min : 1}).withMessage('Body field is required')],
        (req, res) => {
    
*/  
  // Token Verification
  /*
  jwt.verify(req.token, 'secret', (err, authData) => {
    if(err) res.sendStatus(403);
    else res.json(authData);  
  })
  */

  ////
  /*
  const errors = validationResult(req);
  console.log(errors.mapped());
  if(!errors.isEmpty()){
    res.json(errors.mapped());
  }
  else{
    const newBlog = new Blog({
      title : req.body.title,
      body : req.body.body
    });
    newBlog.save().then(blog => res.json(blog));
  }  
})
*/



//GET Request
// R E G I S T E R E D    U S E R S  /////// 
app.get('/register', (req, res) => {
  Blogger.find()
    .then(blogger => res.json(blogger))
    .catch(err => res.send(err));
});

//Server Register Route
//POST request

app.post('/register', 
        [check('name').isLength({min : 1}).withMessage('Name field is required'),
        check('username').isLength({min : 1}).withMessage('Username field is required'),
        check('password').isLength({min : 1}).withMessage('Password field is required'),
        check('password2').isLength({min : 1}).withMessage('Password Confirmation field is required')],
        (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.json(errors.mapped());
  }
  else{
    const newBlogger = new Blogger({
      name : req.body.name,
      username : req.body.username,
      password : req.body.password
    });
    //newBlogger.save().then(blogger => res.json(blogger));
  
    bcrypt.genSalt(10, (err, salt) => {
      if(err) return err;
      bcrypt.hash(newBlogger.password, salt, (err, hash) => {
        if(err)return err;
        newBlogger.password = hash;
        newBlogger.save().then(blogger => res.json(blogger));
      });
    });
}
});

app.post('/login', 
        [check('username').isLength({min : 1}).withMessage('Username field is required'),
        check('password').isLength({min : 1}).withMessage('Password field is required')],
        (req, res, next) => {

  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    res.send({status : 400, errors : errors.mapped()});
  }
  else{
    passport.authenticate('local', function(err, user) {
      if (err) { return next(err) }
      if (!user) {
          //res.local("username", req.param('username'));
          //return res.render('login', { error: true });
          res.send({status : 404, errors : ['Wrong Username/Password']});
      }
  
      // make passportjs setup the user object, serialize the user, ...
      req.login(user, {}, function(err) {
        console.log(user);
        userId = user._id;
        jwt.sign({user: req.user}, 'secret', (err, token) => {
          if(err) return err;
          else{
            res.json({status : 200, user : userId})
          }
        });
      });
    })(req, res, next);
  }
  
   
  /*
  Blogger.findOne({username : req.body.username}, (err, blogger) => {
    if(err)return 'Login error';
    else{
      bcrypt.compare(req.body.password, blogger.password, (err, isMatch) => {
        if(err)throw err;
        if(isMatch){
          res.send('Logged In')
        }
        else{
          res.send('Failed to Log In');
        }
      });
    }
    
  });
  */
  
});

app.get('/loggeduser', (req, res) => {
  res.send(userId);
})

// LOGOUT ROUTE

app.get('/logout', (req, res) => {
  //console.log(req.user);
  userId = '';
  req.logout();
  res.sendStatus(200);  
});

/*
let article = require('./routes/article');
app.use('/article', article);
let users = require('./routes/users');
app.use('/users', users);
*/

function verifyToken(req, res, next){
  
  // Get auth header Value
  //Sending JWT in the header as Authorization Value
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    //Format of token
  // Authorization: Bearer <Token>
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];   
    req.token = bearerToken;
    
  }
  else{
    res.sendStatus(403).json({msg: 'in verify function'});
  }
  next();
}



// Start Server
app.listen(5000, () => {
  console.log("Server started successfully");
});
