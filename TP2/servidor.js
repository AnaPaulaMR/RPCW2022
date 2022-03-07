const http = require('http')
const url = require('url')
const fs = require('fs')

myserver = http.createServer(function(req, res) {
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + ' ' + req.url + ' ' + d)

    var myurl = '',
        x = req.url.split('/');
    
    if(req.url === '/' ||req.url === '/atores' || req.url === '/filmes') {
        myurl = 'index';
    } else if(x[2]) {
        if(x[1][0] === x[2][0]) {
            myurl = req.url.split('/')[2];
        }
    }

    fs.readFile('./arquivos/' + myurl + '.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

        if(err) {
            res.write('<p>Erro na leitura do ficheiro...</p>')
        } else {
            res.write(data)
        }
    })
})

myserver.listen(7777);
console.log('Servidor à escuta na porta 7777...')