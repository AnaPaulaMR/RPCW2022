
const fs = require('fs');

const filmList = [];
const atorList = {};
var sortedAtores = [];

// Ler o ficheiro 'cinemaATP.json'
fs.readFile('cinemaATP.json', function (err, data) {
    if (err) {
        console.log('Erro na leitura do ficheiro...');
    } else {

        // Fazer o parse do ficheiro lido para JSON
        data = JSON.parse(data);

        // Se a pasta 'arquivos' não existir, criá-la
        fs.mkdir('./arquivos', { recursive: true }, function (err) {
            if (err) {
                console.log('Erro na criação da pasta arquivos...');
            } else {

                // Para cada filme criar um ficheiro html
                data.forEach(function (item, index) {
                    var content = '<!DOCTYPE html>'
                        + '<html>'
                        + '<head>'
                        + '<meta charset="utf-8"></head>'
                        + '<title>' + item.title + '</title>'
                        + '</head>'
                        + '<body style="background-color: #1d2a35; color: white; margin: 50px;">'
                        + '<h1 style="font-size: 72px; margin-bottom: 0;">' + item.title + '</h1>'
                        + '<p style="color: #dddddd">' + item.year + ' - ' + item.genres.join(', ') + '</p>'
                        + '<h3>Atores Principais:</h3>'
                        + '<ul>';

                    item.cast.forEach(function (ator) {
                        content += '<li>' + ator + '</li>';
                        try {
                            atorList[ator].push(item.title);
                        } catch (err) {
                            atorList[ator] = [];
                            atorList[ator].push(item.title);
                        }
                    });

                    content += '</ul>'
                        + '</body>'
                        + '</html>';

                    // Criação do ficheiro f.html
                    fs.writeFile('./arquivos/f' + index + '.html', content, function (err) {
                        if (err) {
                            console.log('Erro na criação do ficheiro f' + index + '.html...');
                        } else {
                            filmList.push({ 'index': index, 'title': item.title });

                            // Quando no uĺtimo elemento, criar o ficheiro index.html
                            if (filmList.length === data.length) {
                                var content = '<!DOCTYPE html>'
                                    + '<html>'
                                    + '<head>'
                                    + '<meta charset="utf-8"></head>'
                                    + '<title>Filmes</title>'
                                    + '<style>'
                                    + 'div { width: 50% }'
                                    + '@media only screen and (max-width: 600px) {'
                                    + 'div { width: 100% }'
                                    + '}'
                                    + '</style>'
                                    + '</head>'
                                    + '<body style="background-color: #1d2a35; color: white; margin: 50px;">'
                                    + '<h1 style="font-size: 72px; margin-bottom: 0;">Filmes</h1>'
                                    + '<div style="display: inline-block; float: left;">'
                                    + '<h3>Lista de Atores:</h3>'
                                    + '<ul>';

                                // Lista de atores
                                sortedAtores = Object.keys(atorList);
                                sortedAtores.sort(function (a, b) {
                                    let x = a.toLowerCase();
                                    let y = b.toLowerCase();
                                    if (x < y) { return -1; }
                                    if (x > y) { return 1; }
                                    return 0;
                                });

                                for (var i = 0; i < sortedAtores.length; i++) {
                                    content += '<li><a style="color: white; font-size: 20px; text-decoration: none;" href="http://localhost:7777/atores/a' + i + '">' + sortedAtores[i] + '</a></li>';
                                }

                                content += '</ul>'
                                    + '</div>'
                                    + '<div style="display: inline-block;">'
                                    + '<h3>Lista de Filmes:</h3>'
                                    + '<ul>';

                                // Lista de filmes
                                filmList.sort(function (a, b) {
                                    let x = a.title.toLowerCase();
                                    let y = b.title.toLowerCase();
                                    if (x < y) { return -1; }
                                    if (x > y) { return 1; }
                                    return 0;
                                });

                                filmList.forEach(function(f) {
                                    content += '<li><a style="color: white; font-size: 20px; text-decoration: none;" href="http://localhost:7777/filmes/f' + f.index + '">' + f.title + '</a></li>';
                                });

                                content += '</ul>'
                                    + '</div>'
                                    + '</body>'
                                    + '</html>';

                                // Criação do ficheiro index.html
                                fs.writeFile('./arquivos/index.html', content, function (err, data) {
                                    if (err) {
                                        console.log('Erro na criação do ficheiro index.html...');
                                    } else {

                                        // Para cada ator criar um ficheiro html
                                        for (var i = 0; i < sortedAtores.length; i++) {
                                            var content = '<!DOCTYPE html>'
                                                + '<html>'
                                                + '<head>'
                                                + '<meta charset="utf-8"></head>'
                                                + '<title>' + sortedAtores[i] + '</title>'
                                                + '</head>'
                                                + '<body style="background-color: #1d2a35; color: white; margin: 50px;">'
                                                + '<h1 style="font-size: 72px; margin-bottom: 0;">' + sortedAtores[i] + '</h1>'
                                                + '<h3>Filmes:</h3>'
                                                + '<ul>';

                                            atorList[sortedAtores[i]].forEach(function (film) {
                                                content += '<li>' + film + '</li>';
                                            });

                                            content += '</ul>'
                                                + '</body>'
                                                + '</html>';

                                            // Criação do ficheiro a.html
                                            fs.writeFile('./arquivos/a' + i + '.html', content, function (err) {
                                                if (err) {
                                                    console.log('Erro na criação do ficheiro a' + i + '.html...');
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            }
        });
    }
});