var Express = require("express");
var bodyParser = require("body-parser");
const { request, response, application } = require("express");

var app = Express();
var fs = require('fs');

var cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var port = 50102;

app.listen(port, () => {
    console.log("APIs are running at port: " + port);
});

app.get('/api/utentiPremium', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('dbLocale.json');
    var myObject = JSON.parse(data);

    response.send(myObject);
});

app.post('/api/newPremium', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('dbLocale.json');
    var myObject = JSON.parse(data);

    // creazione nuovo utente premium da inserire da Request Parameter
    let newPremium = {
        "Nome": request.body['Nome'],
        "Cognome": request.body['Cognome'],
        "Email": request.body['Email'],
        "Password": request.body['Password']
    };

    //aggiunta nuovo utente
    myObject.premium_users.push(newPremium);

    //aggiornamento file json con il nuovo utente
    var newData = JSON.stringify(myObject);
    fs.writeFile('dbLocale.json', newData, err => {
        // error checking
        if (err) throw err;
    });

    response.json("Utente Aggiunto Correttamente: (" + myObject.premium_users.length + ")");
});

app.delete('/api/DeletePremium/:email', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('dbLocale.json');
    var myObject = JSON.parse(data);

    // Ricerca dell'utente con quella determinata email
    for(let [i, utente] of myObject.premium_users.entries()){

        if(utente.Email == request.params.email){
            myObject.premium_users.splice(i, 1);
        }
    }

    //aggiornamento file json
    var newData = JSON.stringify(myObject);
    fs.writeFile('dbLocale.json', newData, err => {
        // error checking
        if (err) throw err;
    });

    response.json("Utente cancellato Correttamente: (" + myObject.premium_users.length + ")");
});