var express = require('express');
var router = express.Router();


/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency


var options = {
  auth: {authdb: 'admin'},
  user: "root",
  pass: "PZlVg9gwTBCA",
  useNewUrlParser: true
}
mongoose.connect("mongodb://localhost:27017/noteDB", options);






var User = mongoose.model('User'); //Makes an object from that schema as a model
var Note = mongoose.model('Note'); //Makes an object from that schema as a model







var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});




/* GET users listing. */
router.get('/notes', function(req, res, next) {

  Note.find({email: req.session.user.email}, function(err,noteList) { //Calls the find() method on your database
    if (err) return console.error(err); //If there's an error, print it out
    else {
      console.log(noteList); //Otherwise console log the comments you found
      res.json(noteList);
    }
  })

});



router.post('/notes', function(req, res, next) {

  console.log(req.session.user);

  var newnote = new Note({
    email: req.session.user.email,
    note:  req.body.note});

  newnote.save(function(err, post) {
    if (err) return console.error(err);
    console.log(post);
    res.sendStatus(200);
  });

});




module.exports = router;
