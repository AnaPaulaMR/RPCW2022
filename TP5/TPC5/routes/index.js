var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/musicas')
});

router.get('/musicas', function (req, res, next) {
  axios.get("http://localhost:3000/musicas")
    .then(response => {
      var lista = response.data;
      res.render('musicas', { musicas: lista });
    })
    .catch(function (erro) {
      res.render('error', { error: erro });
    });
});

router.get('/musicas/:id', function (req, res, next) {
  axios.get("http://localhost:3000/musicas/" + req.params.id)
    .then(response => {
      var dados = response.data;
      res.render('musica', { musica: dados });
    })
    .catch(function (erro) {
      res.render('error', { error: erro });
    });
});

router.get('/musicas/prov/:id', function (req, res, next) {
  axios.get("http://localhost:3000/musicas?prov=" + req.params.id)
    .then(response => {
      var lista = response.data;
      res.render('prov', { prov: lista });
    })
    .catch(function (erro) {
      res.render('error', { error: erro });
    });
});

module.exports = router;