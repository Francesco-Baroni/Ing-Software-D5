var Express = require("express");
var app = Express();


const { request, response, application } = require("express");

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Customer API",
            version: '1.0.0',
            description: "Customer API Information",
            contact: {
                name: "G33",
                url: 'http://localhost:50102/',
            },
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
        },
        servers: [
            {
                url: 'http://localhost:50102/',
            } ,
        ],
        
    },
    apis: ["./index.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


var fs = require('fs');
const https = require('https');
const xml2js = require('xml2js');
var bodyParser = require("body-parser");

var cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = 50102;

app.listen(port, () => {
    console.log("APIs are running at port: " + port);
});

/**
 * @swagger
 * /api/utentiPremium:
 *   get:
 *     summary: Ritorna la lista di utenti premium.
 *     description: Ritorna la lista di utenti premium presenti nel sistema.
 *     responses:
 *       200:
 *         description: Lista di utenti premium.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Nome:
 *                         type: string
 *                         description: Il nome dell'utente.
 *                         example: Marco
 *                       Cognome:
 *                         type: string
 *                         description: Il cognome dell'utente.
 *                         example: Munari
 *                       Email:
 *                         type: string
 *                         description: L'email dell'utente.
 *                         example: mmarco18@gmail.com
 *                       Password:
 *                         type: string
 *                         description: La password dell'utente.
 *                         example: marcouni18
 */
app.get('/api/utentiPremium', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('dbLocale.json');
    var myObject = JSON.parse(data);

    response.send(myObject);
});

/**
 * @swagger
 * /api/percorsoAttivo:
 *   get:
 *     summary: Ritorna il percorso attivo.
 *     description: Ritorna il percorso attualmente attivo sulla mappa.
 *     responses:
 *       200:
 *         description: Percorso attivo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: L'id del percorso.
 *                         example: 1
 *                       citta:
 *                         type: string
 *                         description: La città del percorso.
 *                         example: Trento
 *                       start:
 *                         type: string
 *                         description: Il punto di inizio del percorso.
 *                         example: a
 *                       end:
 *                         type: string
 *                         description: La meta del percorso.
 *                         example: b
 *                       poi:
 *                         type: array
 *                         description: Punti di interesse presenti nel percorso.
 *                         items:
 *                           type: object
 *                           properties:
 *                             latitude: 
 *                               type: double
 *                               description: La latitudine del punto
 *                             longitudine: 
 *                               type: double
 *                               description: La longitudine del punto
 *                             nome: 
 *                               type: string
 *                               description: Nome del punto di interesse
 *                             descrizione: 
 *                               type: string
 *                               description: Descrizione del punto di interesse
 *                         example: [11.1266010594048,46.0706757601231,Castello del Buonconsiglio,descrizione bla bla bla]
 *                                        
 */                    
app.get('/api/percorsoAttivo', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('percorsi.json');
    var myObject = JSON.parse(data);
    let attivo = myObject.attivo;
    let indice = -1;

    for (let [i, percorso] of myObject.percorsi.entries()) {

        if (percorso.id == attivo) {
            indice = i;
        }
    }
    if (indice != -1) {
        response.send(myObject.percorsi[indice]);
    } else {
        response.json("Id percorso non trovato");
    }

});

/**
 * @swagger
 * /api/newPremium:
 *   post:
 *     summary: Iscrizione di un utente a premium.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nome:
 *                 type: string
 *                 description: Il nome dell'utente.
 *                 example: Marco
 *               Cognome:
 *                 type: string
 *                 description: Il cognome dell'utente.
 *                 example: Munari
 *               Email:
 *                 type: string
 *                 description: L'email dell'utente.
 *                 example: mmarco18@gmail.com
 *               Password:
 *                 type: string
 *                 description: La password dell'utente.
 *                 example: marcouni18
 *     responses:
 *       201:
 *         description: successful executed
*/
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

/**
 * @swagger
 * /api/newPercorso:
 *   post:
 *     summary: Creazione di un percorso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                       citta:
 *                         type: string
 *                         description: La città del percorso.
 *                         example: Trento
 *                       start:
 *                         type: string
 *                         description: Il punto di inizio del percorso.
 *                         example: a
 *                       end:
 *                         type: string
 *                         description: La meta del percorso.
 *                         example: b
 *                       poi:
 *                         type: array
 *                         description: Punti di interesse presenti nel percorso.
 *                         items:
 *                           type: object
 *                           properties:
 *                             latitudine: 
 *                               type: double
 *                               description: La latitudine del punto
 *                             longitudine: 
 *                               type: double
 *                               description: La longitudine del punto
 *                             nome: 
 *                               type: string
 *                               description: Nome del punto di interesse
 *                             descrizione: 
 *                               type: string
 *                               description: Descrizione del punto di interesse
 *                         example: [11.1266010594048,46.0706757601231,Castello del Buonconsiglio,descrizione bla bla bla]
 *     responses:
 *       201:
 *         description: successful executed
*/
app.post('/api/newPercorso', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('percorsi.json');
    var myObject = JSON.parse(data);
    let percorso = request.body;

    // creazione nuovo percorso da inserire da Request Parameter
    let idCorrente = myObject.percorsi.length;
    myObject.attivo = idCorrente;
    percorso.id = idCorrente;

    //aggiunta nuovo utente
    myObject.percorsi.push(percorso);

    //aggiornamento file json con il nuovo utente
    var newData = JSON.stringify(myObject);
    fs.writeFile('percorsi.json', newData, err => {
        // error checking
        if (err) throw err;
    });

    response.json("Percorso Aggiunto Correttamente: (" + myObject.percorsi.length + ")");
});

/**
 * @swagger
 * /api/DeletePremium/{email}:
 *   delete:
 *     summary: Rimozione di un utente
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *             type: string
 *         required: true
 *         description: the product name
 *     responses:
 *       200:
 *         description: the product was deleted
 *       404:
 *         description: the product was not found
*/
app.delete('/api/DeletePremium/:email', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('dbLocale.json');
    var myObject = JSON.parse(data);

    // Ricerca dell'utente con quella determinata email
    for (let [i, utente] of myObject.premium_users.entries()) {

        if (utente.Email == request.params.email) {
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

/**
 * @swagger
 * /api/PuntiInteresse/{comune}:
 *   get:
 *     summary: Ritorna la lista di punti di interesse.
 *     description: Ritorna la lista di punti di interesse nella città specificata.
 *     parameters: 
 *       - in: path
 *         name: comune
 *         schema:
 *             type: string
 *         required: true
 *         description: Luogo di cui si vogliono visualizzare i punti di interesse
 *     responses:
 *        200:
 *          description: Lista dei comuni.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object 
 *        404:
 *          description: element not found
 *   
 */
app.get('/api/PuntiInteresse/:comune', (request, response) => {
    var url = 'https://opendata.beniculturali.it/searchPlace?modulo=luoghi&comune=' + request.params.comune;

    https.get(url, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(data);
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                // `result` is a JavaScript object
                // convert it to a JSON string
                const json = JSON.stringify(result, null, 4);

                fs.writeFile('luoghi.json', json, err => {
                    // error checking
                    if (err) throw err;
                });

                // log JSON string
                response.json(result);
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

app.get('/api/PercorsiPreferiti', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('percorsi.json');
    var myObject = JSON.parse(data);
    var preferitiJson = JSON.parse('{"percorsi": []}')

    // Ricerca dell'utente con quella determinata email
    for (let [i, percorso] of myObject.percorsi.entries()) {
        if (percorso.preferito == 1) {
            preferitiJson.percorsi.push(myObject.percorsi[i]);
        }
    }

    response.send(preferitiJson);
});

module.exports = app;