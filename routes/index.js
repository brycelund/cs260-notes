var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.hasOwnProperty('user')){
    res.render('index');
  }else{
    res.redirect("/authentication/login");
  }
  
});

module.exports = router;
