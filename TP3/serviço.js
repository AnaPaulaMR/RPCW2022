const axios = require('axios');
const http = require('http');
const url = require('url');

function indexPage() {
    var index =
        '<!DOCTYPE html>' +
        '<html>' +
        '   <head>' +
        '       <meta charset="utf-8">' +
        '       <title>Escola de Música</title>' +
        '       <style>' +
        '           body {' +
        '               min-width: 300px;' +
        '               min-width: 600px;' +
        '               font-family: Calibri, sans-serif;' +
        '               color: #3b4252;' +
        '               padding: 50px;' +
        '           }' +
        '           h1 {' +
        '               font-size: 72px;' +
        '           }' +
        '           a {' +
        '               font-size: 30px;' +
        '               color: #3b4252;' +
        '               text-decoration: none;' +
        '           }' +
        '       </style>' +
        '   </head>' +
        '   <body>' +
        '       <h1>Escola de Música</h1>' +
        '       <ul>' +
        '           <li><a href="http://localhost:4000/alunos">Lista de Alunos</a></li>' +
        '           <li><a href="http://localhost:4000/cursos">Lista de Cursos</a></li>' +
        '           <li><a href="http://localhost:4000/instrumentos">Lista de Instrumentos</a></li>' +
        '       </ul>' +
        '   </body>' +
        '</html>';

    return index;
}

function dataToTable(res, myurl, type) {
    axios.get('http://localhost:3000' + myurl
    ).then(function (resp) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

        var data = resp.data,
            table =
                '<!DOCTYPE html>' +
                '<html>' +
                '   <head>' +
                '       <meta charset="utf-8">' +
                '       <title>Lista de ' + type + '</title>' +
                '       <style>' +
                '           body {' +
                '               min-width: 600px;' +
                '               font-family: Calibri, sans-serif;' +
                '               color: #3b4252;' +
                '               padding: 50px;' +
                '           }' +
                '           h1 {' +
                '               font-size: 72px;' +
                '           }' +
                '           a {' +
                '               color: #3b4252;' +
                '               text-decoration: none;' +
                '           }' +
                '           table {' +
                '               width: 100%;' +
                '               border-collapse: collapse;' +
                '           }' +
                '           th, td {' +
                '               height: 30px;' +
                '               border: 2px solid #3b4252;' +
                '               padding: 5px;' +
                '           }' +
                '           td {' +
                '               cursor: pointer;' +
                '           }' +
                '       </style>' +
                '   </head>' +
                '   <body>' +
                '       <h1>' + type + ' da Escola de Música</h1>' +
                '       <table>';

        switch (type) {
            case 'Alunos':
                table +=
                    '<tr>' +
                    '   <th>ID</th>' +
                    '   <th>Nome</th>' +
                    '   <th>Data de Nascimento</th>' +
                    '   <th>Curso</th>' +
                    '   <th>Ano de Curso</th>' +
                    '   <th>Instrumento</th>' +
                    '</tr>';

                data.forEach(d => {
                    table +=
                        '<tr onclick="window.open(\'http://localhost:4000/instrumentos?q=' + encodeURIComponent(d.instrumento) + '\', \'_self\')">' +
                        '   <td>' + d.id + '</td>' +
                        '   <td>' + d.nome + '</td>' +
                        '   <td>' + d.dataNasc + '</td>' +
                        '   <td>' + d.curso + '</td>' +
                        '   <td>' + d.anoCurso + '</td>' +
                        '   <td>' + d.instrumento + '</td>' +
                        '</tr>';
                });
                break;
            case 'Cursos':
                table +=
                    '<tr>' +
                    '   <th>ID</th>' +
                    '   <th>Designação</th>' +
                    '   <th>Duração</th>' +
                    '   <th>ID de Instrumento</th>' +
                    '   <th>Designação de Instrumento</th>' +
                    '</tr>';

                data.forEach(d => {
                    table +=
                        '<tr onclick="window.open(\'http://localhost:4000/alunos?curso=' + d.id + '\', \'_self\')">' +
                        '   <td>' + d.id + '</td>' +
                        '   <td>' + d.designacao + '</td>' +
                        '   <td>' + d.duracao + '</td>' +
                        '   <td>' + d.instrumento.id + '</td>' +
                        '   <td>' + d.instrumento['#text'] + '</td>' +
                        '</tr>';
                });
                break;
            case 'Instrumentos':
                table +=
                    '<tr>' +
                    '   <th>ID</th>' +
                    '   <th>Designação</th>' +
                    '</tr>';

                data.forEach(d => {
                    table +=
                        '<tr onclick="window.open(\'http://localhost:4000/cursos?instrumento.id=' + d.id + '\', \'_self\')">' +
                        '   <td>' + d.id + '</td>' +
                        '   <td>' + d['#text'] + '</td>' +
                        '</tr>';
                });
                break;
        }

        table +=
            '       </table>' +
            '   </body>' +
            '</html>';

        res.write(table);
        res.end();
    }).catch(function (err) {
        console.log(err);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<p>Occurreu um erro na consulta à API de dados!</p>')
    });
}


myserver = http.createServer(function (req, res) {
    var d = new Date().toISOString().substring(0, 16);
    console.log(req.method + ' ' + req.url + ' ' + d);

    var myurl = url.parse(req.url, true).pathname
    switch (myurl) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(indexPage());
            res.end();
            break;
        case '/alunos':
            dataToTable(res, req.url, 'Alunos');
            break;
        case '/cursos':
            dataToTable(res, req.url, 'Cursos');
            break;
        case '/instrumentos':
            dataToTable(res, req.url, 'Instrumentos');
            break;
        default:
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<p>Rota não suportada: ' + req.url + '</p>');
    }
});

myserver.listen(4000);
console.log('Servidor à escuta na porta 4000...');