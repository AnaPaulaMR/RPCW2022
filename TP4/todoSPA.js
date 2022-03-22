var http = require('http')
var axios = require('axios')

var { parse } = require('querystring');

// Funções auxiliares
var countId = 2;
function newId() {
    return 't' + countId++;
}

function recuperaInfo(request, callback) {
    if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', bloco => {
            body += bloco.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
}

function indexPage(todo, done, task) {
    var index =
        '<!DOCTYPE html>' +
        '<html style="height: 100%;">' +
        '   <head>' +
        '       <title>Lista de tarefas</title>' +
        '       <meta charset="utf-8"/>' +
        '       <style>' +
        '       * {' +
        '           box-sizing: border-box;' +
        '           margin: 0;' +
        '       }' +
        '       input, label {' +
        '           height: 30px;' +
        '           line-height: 30px;' +
        '           margin: 10px 5px;' +
        '       }' +
        '       a {' +
        '           color: black;' +
        '           text-decoration: none;' +
        '       }' +
        '       </style>' +
        '   </head>' +
        '   <body style="height: calc(100% - 20px); background: aliceblue; margin: 10px;">' +
        '       <div style="height: 280px; border: 1px solid cornflowerblue;">' +
        '           <div style="height: 60px; background: cornflowerblue; color: white; padding: 10px;">' +
        '               <h1 style="line-height: 40px;">Nova Tarefa</h1>' +
        '           </div>' +
        '           <form style="height: 220px; padding: 10px;" action="/tarefas" method="POST">' +
        '               <input type="hidden" id="id" name="id" value="' + task.id + '"></input>' +
        '               <input type="hidden" id="type" name="type" value="' + task.type + '"></input>' +
        '               <input type="hidden" id="dateCreated" name="dateCreated" value="' + task.dateCreated + '"></input>' +
        '               <div style="display: flex;">' +
        '                   <label for="owner"><b>Utilizador: </b></label>' +
        '                   <input style="width: 100%;" type="text" id="owner" name="owner" value="' + (task == undefined ? "" : task.owner) + '"></input>' +
        '               </div>' +
        '               <div style="display: flex;">' +
        '                   <label for="description"><b>Descrição: </b></label>' +
        '                   <input style="width: 100%;" type="text" id="description" name="description" value="' + (task == undefined ? "" : task.description) + '"></input>' +
        '               </div>' +
        '               <div style="display: flex;">' +
        '                   <label for="dateDue"><b>Entrega: </b></label>' +
        '                   <input style="width: 100%;" type="date" id="dateDue" name="dateDue" min="' + (task == undefined ? new Date().toISOString().substring(0, 10) : task.dateCreated) + '" value="' + (task == undefined ? new Date().toISOString().substring(0, 10) : task.dateDue) + '"></input>' +
        '               </div>' +
        '               <div style="display: flex;">' +
        '                   <input style="width: 50%;" type="submit" value="Registar"></input>' +
        '                   <input style="width: 50%;" type="reset" value="Limpar valores"></input>' +
        '               </div>' +
        '           </form>' +
        '       </div>' +
        '       <div style="display: flex; flex-direction: row; height: calc(100% - 280px);">' +
        todo +
        done +
        '       </div>' +
        '   </body>' +
        '</head>';

    return index;
}

function getToDoTasks(tasks) {
    var todo =
        '<div style="width: 50%; border: 1px solid cornflowerblue; margin: 10px 5px 0 0;">' +
        '   <div style="background: cornflowerblue; color: white; padding: 10px;">' +
        '       <h2>Por Fazer</h1>' +
        '   </div>' +
        '   <div style="overflow-y: auto;">';

    tasks.forEach(task => {
        todo +=
            '<div style="height: 75px; border-bottom: 1px solid cornflowerblue; padding: 5px;">' +
            '   <div style="display: flex; justify-content: space-between; margin: 10px;">' +
            '       <span>' +
            '           <a href="http://localhost:7777/tarefas/' + task.id + '/realizada">&#10003;</a>' +
            '           &nbsp;&nbsp;' + task.description +
            '       </span>' +
            '       <a href="http://localhost:7777/tarefas/' + task.id + '/editar"><b><i>Edit</i></b></a>' +
            '   </div>' +
            '   <div style="display: flex; justify-content: space-between; font-size: 12px; color: #333333; margin: 10px;"> ' +
            '       <span>Utilizador: ' + task.owner + '</span>' +
            '       <span>Criada em: ' + task.dateCreated + '</span>' +
            '       <span>Entrega em: ' + task.dateDue + '</span>' +
            '   </div>' +
            '</div>';
    });

    todo +=
        '   </div>' +
        '</div>';

    return todo;
}

function getDoneTasks(tasks) {
    var done =
        '<div style="width: 50%; border: 1px solid cornflowerblue; margin: 10px 0 0 5px;">' +
        '   <div style="background: cornflowerblue; color: white; padding: 10px;">' +
        '       <h2>Realizadas</h1>' +
        '   </div>' +
        '   <div style="overflow-y: auto;">';

    tasks.forEach(task => {
        done +=
            '<div style="height: 75px; border-bottom: 1px solid cornflowerblue; padding: 5px;">' +
            '   <div style="display: flex; justify-content: space-between; margin: 10px;">' + task.description + '<a href="http://localhost:7777/tarefas/' + task.id + '/apagar"><b>X</b></a></div>' +
            '   <div style="display: flex; justify-content: space-between; font-size: 12px; color: #333333;  margin: 10px;"> ' +
            '       <span>Utilizador: ' + task.owner + '</span>' +
            '       <span>Criada em: ' + task.dateCreated + '</span>' +
            '       <span>Entrega em: ' + task.dateDue + '</span>' +
            '   </div>' +
            '</div>';
    });

    done +=
        '   </div>' +
        '</div>';

    return done;
}

var todoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substring(0, 16);
    console.log(req.method + " " + req.url + " " + d);

    // Tratamento do pedido
    switch (req.method) {
        case "GET":
            // GET /tarefas --------------------------------------------------------------------
            if ((req.url == "/") || (req.url == "/tarefas")) {
                var todo, done;

                axios.get("http://localhost:3000/tarefas?type=porfazer")
                    .then(response => {
                        todo = getToDoTasks(response.data);
                    })
                    .catch(function (erro) {
                        todo = '<p style="padding: 10px;">Não foi possível obter a lista de tarefas por fazer...';
                    })
                    .finally(() => {
                        axios.get("http://localhost:3000/tarefas?type=realizada")
                            .then(response => {
                                done = getDoneTasks(response.data);
                            })
                            .catch(function (erro) {
                                done = '<p style="padding: 10px;">Não foi possível obter a lista de tarefas realizadas...';
                            })
                            .finally(() => {
                                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                                res.write(indexPage(todo, done));
                                res.end();
                            });
                    });
            }
            // GET /tarefas/:id/apagar --------------------------------------------------------------------
            else if (/\/tarefas\/t[0-9]+\/apagar$/.test(req.url)) {
                var idTarefa = req.url.split("/")[2];
                axios.delete("http://localhost:3000/tarefas/" + idTarefa)
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(function (erro) {
                        console.log(erro);
                    })
                    .finally(() => {
                        res.writeHead(302, { 'Location': 'http://localhost:7777/tarefas' });
                        res.end();
                    });
            }
            // GET /tarefas/:id/realizadas --------------------------------------------------------------------
            else if (/\/tarefas\/t[0-9]+\/realizada$/.test(req.url)) {
                var idTarefa = req.url.split("/")[2];

                axios.get("http://localhost:3000/tarefas/" + idTarefa)
                    .then(response => {
                        task = response.data;

                        axios.put("http://localhost:3000/tarefas/" + idTarefa, {
                            "id": task.id,
                            "type": "realizada",
                            "description": task.description,
                            "dateCreated": task.dateCreated,
                            "dateDue": task.dateDue,
                            "owner": task.owner
                        })
                            .then(response => {
                                console.log(response.data);
                            })
                            .catch(function (erro) {
                                console.log(erro);
                            });
                    })
                    .catch(function (erro) {
                        console.log(erro);
                    })
                    .finally(() => {
                        res.writeHead(302, { 'Location': 'http://localhost:7777/tarefas' });
                        res.end();
                    });
            }
            // GET /tarefas/:id/editar --------------------------------------------------------------------
            else if (/\/tarefas\/t[0-9]+\/editar$/.test(req.url)) {
                var idTarefa = req.url.split("/")[2];
                var todo, done, task;

                axios.get("http://localhost:3000/tarefas/" + idTarefa)
                    .then(response => {
                        task = response.data;
                    })
                    .catch(function (erro) {
                        console.log(erro);
                    })
                    .finally(() => {
                        axios.get("http://localhost:3000/tarefas?type=porfazer")
                            .then(response => {
                                todo = getToDoTasks(response.data);
                            })
                            .catch(function (erro) {
                                todo = '<p style="padding: 10px;">Não foi possível obter a lista de tarefas por fazer...';
                            })
                            .finally(() => {
                                axios.get("http://localhost:3000/tarefas?type=realizada")
                                    .then(response => {
                                        done = getDoneTasks(response.data);
                                    })
                                    .catch(function (erro) {
                                        done = '<p style="padding: 10px;">Não foi possível obter a lista de tarefas realizadas...';
                                    })
                                    .finally(() => {
                                        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                                        res.write(indexPage(todo, done, task));
                                        res.end();
                                    });
                            });
                    });
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>");
                res.end();
            }
            break
        case "POST":
            if (req.url === '/tarefas') {
                recuperaInfo(req, resultado => {
                    console.log('POST de tarefa: ' + JSON.stringify(resultado));

                    axios.get("http://localhost:3000/tarefas/" + resultado.id)
                        .then(response => {
                            axios.put("http://localhost:3000/tarefas/" + resultado.id, {
                                "id": resultado.id,
                                "type": resultado.type,
                                "description": resultado.description,
                                "dateCreated": resultado.dateCreated,
                                "dateDue": resultado.dateDue,
                                "owner": resultado.owner
                            })
                                .then(response => {
                                    console.log(response.data);
                                })
                                .catch(function (erro) {
                                    console.log(erro);
                                })
                                .finally(() => {
                                    res.writeHead(302, { 'Location': 'http://localhost:7777/tarefas' });
                                    res.end();
                                });
                        })
                        .catch(function (erro) {
                            axios.post("http://localhost:3000/tarefas", {
                                "id": newId(),
                                "type": "porfazer",
                                "description": resultado.description,
                                "dateCreated": new Date().toISOString().substring(0, 10),
                                "dateDue": resultado.dateDue,
                                "owner": resultado.owner
                            })
                                .then(response => {
                                    console.log(response.data);
                                })
                                .catch(function (erro) {
                                    console.log(erro);
                                })
                                .finally(() => {
                                    res.writeHead(302, { 'Location': 'http://localhost:7777/tarefas' });
                                    res.end();
                                });
                        })
                });
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.write("<p>Recebi um POST não suportado neste serviço.</p>");
                res.end();
            }
            break
        default:
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
            res.write("<p>" + req.method + " não suportado neste serviço.</p>");
            res.end();
    }

});

todoServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')