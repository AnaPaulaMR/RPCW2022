var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: './uploads'});
var fs = require('fs');

var File = require('../controllers/file');

/* GET home page. */
router.get('/', function(req, res,) {
  File.list()
  .then((data) => {
    res.render('index', { list: data});
   })
   .catch((err) => {
    res.render('error', { error: err});
   });
});

router.get('/remove/:id', function(req, res,) {
  File.remove(req.params.id)
  .then(() => {
    res.redirect('/');
  })
  .catch((err) => {
    res.render('error', { error: err});
  });
});

router.post('/', upload.single('myFile'), function(req, res,) {
  var d = new Date().toISOString().substring(0, 16);

  var file = {
    date: d,
    description: req.body.description,
    name: req.file.originalname,
    file: req.file.path,
    size: req.file.size,
    type: req.file.mimetype
  }

  File.insert(file)
  .then(() => {
    res.redirect('/');
   })
   .catch((err) => {
    res.render('error', { error: err});
   });
});

module.exports = router;
