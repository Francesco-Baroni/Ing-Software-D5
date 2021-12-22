//Token personale per accedere ai servizi di MapBox
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNlc2NvLWJhcm9uaSIsImEiOiJja3dybnUxY2gweTNoMzJxb3R6dGFxaDlwIn0.pkOvW-8R444cL5Wwks_teQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [12.674297, 42.6384261], //Posizione iniziale della mappa: Italia
    zoom: 5
});

let DatiPuntiDiInteresse;
let Start, End; // Inizio e fine del percorso
let PuntiInteresseSelezionati = new Array();
let Preferito = false;


//Campi per costruire la pagina HTML

const txtCitta = document.createElement('input');
txtCitta.setAttribute('type', 'text');
txtCitta.setAttribute('id', 'txtCitta');
txtCitta.setAttribute('placeholder', 'Inserisci una città');
txtCitta.onkeyup = function () { inserimentoCitta(txtCitta.value) };

const divPartenzaArrivo = document.createElement('div');
divPartenzaArrivo.setAttribute('id', 'divPartenzaArrivo')

const txtPartenza = document.createElement('input');
txtPartenza.setAttribute('type', 'text');
txtPartenza.setAttribute('id', 'txtPartenza');
txtPartenza.setAttribute('placeholder', 'Partenza');
txtPartenza.onkeyup = function () { inserimentoPartenza(txtPartenza.value) };

const txtArrivo = document.createElement('input');
txtArrivo.setAttribute('type', 'text');
txtArrivo.setAttribute('id', 'txtArrivo');
txtArrivo.setAttribute('placeholder', 'Arrivo');

const btnCercaCitta = document.createElement('input');
btnCercaCitta.setAttribute('type', 'button');
btnCercaCitta.setAttribute('id', 'btnCercaCitta');
btnCercaCitta.setAttribute('value', 'Cerca');
btnCercaCitta.onclick = function () { cercaCitta(txtCitta.value) };

const btnCercaPercorso = document.createElement('input');
btnCercaPercorso.setAttribute('type', 'button');
btnCercaPercorso.setAttribute('id', 'btnCercaPercorso');
btnCercaPercorso.setAttribute('value', 'Cerca');
btnCercaPercorso.onclick = function () { cercaPercorso() };

const btnConfermaPercorso = document.createElement('input');
btnConfermaPercorso.setAttribute('type', 'button');
btnConfermaPercorso.setAttribute('id', 'btnConfermaPercorso');
btnConfermaPercorso.setAttribute('value', 'Conferma e cerca');
btnConfermaPercorso.onclick = function () { creaPercorso(txtPartenza.value, txtArrivo.value) };

const br = document.createElement('br');

const btnPreferito = document.createElement('input');
btnPreferito.setAttribute('type', 'button');
btnPreferito.setAttribute('id', 'btnPreferito');
btnPreferito.setAttribute('value', 'Aggiungi ai preferiti');
btnPreferito.onclick = function () { segnaPreferito() };

const lblOutputUtente = document.createElement('p');
lblOutputUtente.setAttribute('id', 'lblOutputUtente');
lblOutputUtente.innerHTML = "test";

const divListaPuntiDiInteresse = document.createElement('div');
divListaPuntiDiInteresse.setAttribute('id', 'divListaPuntiDiInteresse');

const fromTo = document.getElementById('fromTo');
fromTo.appendChild(txtCitta);
fromTo.appendChild(btnCercaCitta);

fromTo.appendChild(divPartenzaArrivo);
fromTo.appendChild(lblOutputUtente);

divPartenzaArrivo.appendChild(txtPartenza);
divPartenzaArrivo.appendChild(txtArrivo);
fromTo.appendChild(btnCercaPercorso);
fromTo.appendChild(divListaPuntiDiInteresse);


//Quando la città viene inserita, si rende visibile il pulsante per cercare la città
function inserimentoCitta(valore) {
    if (valore != '') {
        btnCercaCitta.style.display = 'block';
    } else {
        btnCercaCitta.style.display = 'none';
    }
}

//Quando il punto di partenza viene inserito, si rende visibile il pulsante per cercare i punti di interesse
function inserimentoPartenza(valore) {
    if (valore != '') {
        btnCercaPercorso.style.display = 'block';
    } else {
        btnCercaPercorso.style.display = 'none';
    }
}

//Funzione crea percorso
async function creaPercorso(txtPartenza, txtArrivo) {
    //Creazione oggetto JSON che conterrà il percorso 
    Start = txtPartenza;
    End = txtArrivo;
    let percorso = {
        "preferito": 0,
        "id": "",
        "citta": txtCitta.value,
        "start": [],
        "end": [],
        "poi": []
    }
    if (Preferito) {
        percorso.preferito = 1;
    }

    //Query a MapBox per trovare la posizione nella mappa dato l'indirizzo di partenza
    const queryS = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${txtPartenza} ${txtCitta.value}.json?limit=1&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
    );
    let cordS = [2];
    const jsonS = await queryS.json();
    cordS[0] = jsonS.features[0].geometry.coordinates[0];
    cordS[1] = jsonS.features[0].geometry.coordinates[1];
    percorso.start.push(cordS);


    //Se l'arrivo non è stato specificato, la partenza verrà utilizzata anche come arrivo
    if (txtArrivo != "") {
        //Query a MapBox per trovare la posizione nella mappa dato l'indirizzo di arrivo
        const queryE = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${txtArrivo}  ${txtCitta.value}.json?limit=1&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
        );
        let cordE = [2];
        const jsonE = await queryE.json();
        cordE[0] = jsonE.features[0].geometry.coordinates[0];
        cordE[1] = jsonE.features[0].geometry.coordinates[1];
        percorso.end.push(cordE);
    } else {
        percorso.end.push(null);
    }

    //Per ogni punto di interesse selezionato dall'utente si cerca la posizione sulla mappa e le inormazione relative tramite le API del ministero del turismo
    for (let i = 0; i < PuntiInteresseSelezionati.length; i++) {
        let POI = {
            "0": 0,
            "1": 0,
            "nome": '',
            "descrizione": '',
            "immagine": ''
        }

        let ricerca = DatiPuntiDiInteresse["mibac-list"]["mibac"][PuntiInteresseSelezionati[i]].luogodellacultura[0].indirizzi[0].indirizzo[0].comune[0];
        ricerca += " ";
        ricerca += DatiPuntiDiInteresse["mibac-list"]["mibac"][PuntiInteresseSelezionati[i]].luogodellacultura[0].indirizzi[0].indirizzo[0]["via-piazza"][0];

        const query = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${ricerca}.json?limit=1&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
        );
        const json = await query.json();
        POI[0] = json.features[0].geometry.coordinates[0];
        POI[1] = json.features[0].geometry.coordinates[1];

        POI["nome"] = DatiPuntiDiInteresse["mibac-list"]["mibac"][PuntiInteresseSelezionati[i]].luogodellacultura[0].denominazione[0].nomestandard[0];
        POI["descrizione"] = DatiPuntiDiInteresse["mibac-list"]["mibac"][PuntiInteresseSelezionati[i]].luogodellacultura[0].descrizione[0].testostandard[0];

        if (DatiPuntiDiInteresse["mibac-list"]["mibac"][PuntiInteresseSelezionati[i]].luogodellacultura[0].allegati[0] != "") {
            POI["immagine"] = DatiPuntiDiInteresse["mibac-list"]["mibac"][PuntiInteresseSelezionati[i]].luogodellacultura[0].allegati[0].allegato[0].url[0];
        }
        else {
            POI["immagine"] = './image/noImg.png';
        }

        percorso.poi.push(POI);
    }

    //Viene salvato il percorso appena generato all'interno del nostro JSON locale
    const response = await fetch('http://localhost:50102/api/newPercorso', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(percorso)
    });

    //Viene chiamata la pagina relativa alla visualizzazione del percorso sulla mappa
    window.location.href = 'MapBox.html';
}

//Viene cercata la città all'interno del database del ministero del turismo, per ricavarne i POI
function cercaCitta(citta) {
    var url = 'http://localhost:50102/api/PuntiInteresse/' + citta;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = async function () {

        let data = JSON.parse(this.response);

        //Se la città non è presente, viene visualizzato un'errore sulla pagina HTML
        if (data["mibac-list"]["mibac"][0] == "") {
            lblOutputUtente.style.display = 'block';
            divPartenzaArrivo.style.display = 'none';
            lblOutputUtente.innerHTML = 'La città inserita non è supportata';

        } else if (request.status >= 200 && request.status < 400) {
            lblOutputUtente.style.display = 'none';
            divPartenzaArrivo.style.display = 'block';
            DatiPuntiDiInteresse = data;
            btnCercaCitta.style.display = 'none';

            //La mappa viene centrata sulla città selezionata
            const queryC = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${citta}.json?country=it&limit=1&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
            );
            let cordC = [2];
            const jsonC = await queryC.json();
            cordC[0] = jsonC.features[0].geometry.coordinates[0];
            cordC[1] = jsonC.features[0].geometry.coordinates[1];

            map.flyTo({
                center: cordC,
                zoom: 12
            });

        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `THE API IS NOT WORKING!`;
            app.appendChild(errorMessage);
        }
    }

    request.send();
}


//Visualizza l'elenco dei punti di interesse, in modo tale che l'utente selezioni quelli desiderati
function cercaPercorso() {
    let indice = 0;
    let riga = 0;
    btnCercaPercorso.style.display = 'none';
    lblOutputUtente.style.display = 'block';
    lblOutputUtente.innerHTML = 'Seleziona i luoghi che vuoi visitare';
    DatiPuntiDiInteresse["mibac-list"]["mibac"].forEach(luogo => {

        const puntoDiInteresse = document.createElement('div');
        puntoDiInteresse.style.top = riga + 'px';
        if (indice % 2 == 0) {
            puntoDiInteresse.setAttribute('class', 'divPuntoDiInteressePari');
        } else {
            puntoDiInteresse.setAttribute('class', 'divPuntoDiInteresseDispari');
            riga += 160;
        }

        puntoDiInteresse.setAttribute('id', 'divPuntoDiInteresse_' + indice);

        const immagine = document.createElement('img');
        immagine.setAttribute('id', 'ImmaginePuntoInteresse');

        const nomeLuogo = document.createElement('p');
        nomeLuogo.setAttribute('id', 'nomeLuogo');
        nomeLuogo.innerHTML = luogo["luogodellacultura"][0].denominazione[0].nomestandard;

        if (luogo["luogodellacultura"][0].allegati[0] != "") {
            immagine.setAttribute('src', luogo["luogodellacultura"][0].allegati[0].allegato[0].url);
        } else {
            immagine.setAttribute('src', './image/noImg.png');
        }

        const cerchioImage = document.createElement('img');
        cerchioImage.setAttribute('id', 'cerchioImage_' + indice);
        cerchioImage.setAttribute('class', 'cerchioImage');
        cerchioImage.setAttribute('src', './image/cerchio.png');

        const checkImage = document.createElement('img');
        checkImage.setAttribute('id', 'checkImage_' + indice);
        checkImage.setAttribute('class', 'checkImage');
        checkImage.setAttribute('src', './image/selezionato.png');

        puntoDiInteresse.appendChild(immagine);
        puntoDiInteresse.appendChild(checkImage);
        puntoDiInteresse.appendChild(cerchioImage);
        puntoDiInteresse.appendChild(nomeLuogo);

        puntoDiInteresse.onclick = function () { aggiungiPunto(puntoDiInteresse) };

        divListaPuntiDiInteresse.appendChild(puntoDiInteresse);

        indice++;
    });

    const spazioFinePagina = document.createElement('div');
    spazioFinePagina.style.top = riga + 'px';
    spazioFinePagina.setAttribute('id', 'spazioFinePagina')
    divListaPuntiDiInteresse.appendChild(spazioFinePagina);

    fromTo.appendChild(btnConfermaPercorso);
    fromTo.appendChild(br);
    fromTo.appendChild(btnPreferito);
}

//Aggiunge un punto di interesse all'Array dei punti di interesse selezionati (che verranno usati per la generazione del percorso)
function aggiungiPunto(puntoDiInteresse) {
    let id = puntoDiInteresse.getAttribute('id');
    let indice = id.toString().slice(id.lastIndexOf('_') + 1);
    const indexRemove = PuntiInteresseSelezionati.indexOf(indice);
    if (indexRemove == -1) {
        document.getElementById("checkImage_" + indice).style.display = 'block';
        document.getElementById("cerchioImage_" + indice).style.display = 'none';
        PuntiInteresseSelezionati.push(indice);
    } else {
        document.getElementById("checkImage_" + indice).style.display = 'none';
        document.getElementById("cerchioImage_" + indice).style.display = 'block';
        PuntiInteresseSelezionati.splice(indexRemove, 1);
    }
}

//Segna che il percorso fa parte dei percorsi preferiti
function segnaPreferito() {
    if (Preferito) {
        Preferito = false;
        btnPreferito.style.background = "rgb(231, 241, 222)";
    } else {
        Preferito = true;
        btnPreferito.style.background = "rgb(64 217 36)";
    }
}

function toMappa() {
    window.location.href = 'MapBox.html';
}

function toAccount() {
    window.location.href = 'testUtenti.html';
}

function toPreferiti() {
    window.location.href = 'preferiti.html';
}