const fs = require('fs');

fs.readFile('arq-son-EVO.json', function(err, data) {
    if(err) {
        console.log("Ocorreu um erro na leiture do ficheiro...");
    } else {
        var data = JSON.parse(data),
            id = 0;
        
        data.musicas.forEach(m => {
            m.id = "id" + id;
            id++;
        });

        fs.writeFile('arq-son-EVO.json', JSON.stringify(data, null, '\t'), function(err) {
            if(err) {
                console.log("Ocurreu um erro na escrita do ficheiro...");
            }
        });
    }
});
