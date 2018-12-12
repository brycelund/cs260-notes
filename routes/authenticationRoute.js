var express = require('express');
var router = express.Router();
var firebase = require('firebase');


// Initialize Firebase
var config = {
  apiKey: "AIzaSyAu9ZuxnRIilyK7oCDNxd7g-oylxpfXVns",
  authDomain: "cs260-d003c.firebaseapp.com",
  databaseURL: "https://cs260-d003c.firebaseio.com",
  projectId: "cs260-d003c",
  storageBucket: "cs260-d003c.appspot.com",
  messagingSenderId: "65543241219"
};
firebase.initializeApp(config);









/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency


var options = {
  auth: {authdb: 'admin'},
  user: "root",
  pass: "PZlVg9gwTBCA",
  useNewUrlParser: true
}
mongoose.connect("mongodb://localhost:27017/noteDB", options);










var userSchema = mongoose.Schema({ //Defines the Schema for this database
    name: String,
    email: String
});

var User = mongoose.model('User', userSchema); //Makes an object from that schema as a model



var noteSchema = mongoose.Schema({ //Defines the Schema for this database
    note: String,
    email: String
});

var Note = mongoose.model('Note', noteSchema); //Makes an object from that schema as a model


var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});








/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post("/login", function(req, res, next){

  let email = req.body.email;
  let password = req.body.password;

  firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {


    User.findOne({email: email}, (err, user) => {
      req.session.user = user;
      res.locals.user = user;
      res.redirect("/authentication");
    });



  }).catch(function(error) {

      // Handle Errors here.
      console.log(error);
      req.flash('login', error.message);
      res.redirect("/authentication/login");
      // ...
  });


})




router.get('/signout', function(req, res) {

    firebase.auth().signOut().then(function() {
      req.session.destroy();
      res.redirect("/authentication/login");
    }).catch(function(error) {
      console.log(error,"Error");
      res.send(error);
      //res.redirect("error");
    });

  });




  // Display sign up page
router.get('/signup', function(req, res) {
    res.render('login', {message: req.flash('signup')});
});






    // Recieve request from initial signup page
  router.post('/signup', function(req, res) {

      let email = req.body.email;
      let password = req.body.password;
      let name = req.body.name;

      delete req.body.password;


      User.findOne({email:email}, (err, result) => {

        if(!result){

      // Create user on firebase
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(response){

            // Add to mongodb
            let newUser = new User(req.body);
            newUser.save();
            req.session.user = req.body;
            res.redirect("/authentication");


        }).catch(err => {
          console.log("An ERROR occured with", email, err.error.message);
          req.flash('signup', err.error.message);
          res.redirect("/signup");
        });


    }else{
      console.log("User already exists", email);
      req.flash('login', "User already exists");
      res.redirect("/login");
    }

    });



  });





module.exports = router;
