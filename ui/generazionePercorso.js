mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNlc2NvLWJhcm9uaSIsImEiOiJja3dybnUxY2gweTNoMzJxb3R6dGFxaDlwIn0.pkOvW-8R444cL5Wwks_teQ';

/*const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [12.674297, 42.6384261], // starting position
    zoom: 5
});

//COORDINATE ITALIA:
//42.6384261
//12.674297*/




let DatiPuntiDiInteresse;
let Citta = '-1';
let Start, End;
let PuntiInteresseSelezionati = new Array();


// Creazione percorso
// create a function to make a directions request
/*async function getRoute(start, end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    let id = 0;
    let pos = [0, 0];
    //setPoint(start, 'start', '#2d8f53');

    let poi = [
        {
            "0": "11.10",
            "1": "46.05",
        },
        {
            "0": "11.10",
            "1": "46.02",
        },
        {
            "0": "11.10",
            "1": "46.03",
        },
        {
            "0": "11.10",
            "1": "46.07",
        },
        {
            "0": "11.10",
            "1": "46.01",
        },
        {
            "0": "11.10",
            "1": "46.06",
        },
        {
            "0": "11.10",
            "1": "46.02",
        }
    ];
    let path = `${start[0]},${start[1]};`;
    for (let p of poi) {
        path += `${p[0]},${p[1]};`
        pos[0] = p[0];
        pos[1] = p[1];
        //setPoint(pos, id, '#2d8f53');
        id++;
    }
    path += `${end[0]},${end[1]}`;

    const query = await fetch(
        `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${path}?roundtrip=false&source=first&destination=last&steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    const data = json.trips[0];
    const route = data.geometry.coordinates;
    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: route
        }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
        map.addLayer({
            id: 'route',
            type: 'line',
            source: {
                type: 'geojson',
                data: geojson
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        });
    }
    // add turn instructions here at the end
    const lblDurata = document.getElementById('lblDurata');
    const durata = Math.floor(data.duration / 60);
    lblDurata.textContent = 'Durata: ' + durata + ' min';
}

map.on('load', () => {
    // make an initial directions request that
    // starts and ends at the same location
    //getRoute(start, end);
});

map.on('click', (event) => {
    const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
    const end = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: coords
                }
            }
        ]
    };
    if (map.getLayer('end')) {
        map.getSource('end').setData(end);
    } else {
        map.addLayer({
            id: 'end',
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'Point',
                                coordinates: coords
                            }
                        }
                    ]
                }
            },
            paint: {
                'circle-radius': 10,
                'circle-color': '#f30'
            }
        });
    }
    getRoute(start, coords);
});*/

//Campi di generazione del percorso

//Barra contenente la citta'
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



function inserimentoPartenza(valore) {
    if (valore != '') {
        if (lblOutputUtente.getAttribute('display') == 'block' && lblOutputUtente.innerHTML == 'Seleziona i luoghi che vuoi visitare') { // non funziona

        } else
            btnCercaPercorso.style.display = 'block';
    } else {
        btnCercaPercorso.style.display = 'none';
    }
}

function inserimentoCitta(valore) {
    if (valore != '') {
        btnCercaCitta.style.display = 'block';
    } else {
        btnCercaCitta.style.display = 'none';
    }
}

async function creaPercorso(txtPartenza, txtArrivo) {
    Start = txtPartenza;
    End = txtArrivo;
    let percorso = {
        "id": "",
        "citta": txtCitta.value,
        "start": [],
        "end": [],
        "poi": []
    }
    const queryS = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${txtPartenza}.json?limit=1&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
    );
    let cordS = [2];
    const jsonS = await queryS.json();
    cordS[0] = jsonS.features[0].geometry.coordinates[0];
    cordS[1] = jsonS.features[0].geometry.coordinates[1];

    percorso.start.push(cordS);

    const queryE = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${txtArrivo}.json?limit=1&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
    );
    let cordE = [2];
    const jsonE = await queryE.json();
    cordE[0] = jsonE.features[0].geometry.coordinates[0];
    cordE[1] = jsonE.features[0].geometry.coordinates[1];

    percorso.end.push(cordE);

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
            POI["immagine"] = 'noImg.png';
        }

        percorso.poi.push(POI);
    }

    const response = await fetch('http://localhost:50102/api/newPercorso', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(percorso)
    });

    window.location.href = 'MapBox.html';
}

function cercaCitta(citta) {
    //var citta = document.getElementById('nomeComune').value;
    var url = 'http://localhost:50102/api/PuntiInteresse/' + citta;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        // Begin accessing XML data here
        let data = JSON.parse(this.response);
        if (data["mibac-list"]["mibac"][0] == "") {
            lblOutputUtente.style.display = 'block';
            divPartenzaArrivo.style.display = 'none';
            lblOutputUtente.innerHTML = 'La città inserita non è supportata';
        } else if (request.status >= 200 && request.status < 400) {
            lblOutputUtente.style.display = 'none';
            divPartenzaArrivo.style.display = 'block';
            DatiPuntiDiInteresse = data;
            btnCercaCitta.style.display = 'none';
            //Posizionare la mappa sulla citta selezionata
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `THE API IS NOT WORKING!`;
            app.appendChild(errorMessage);
        }
    }

    request.send();
    //window.location.href = url;
}

function cercaPercorso() {
    //var citta = document.getElementById('nomeComune').value;
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
            immagine.setAttribute('src', 'noImg.png');
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
}


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


/*
function setPoint(pos, id, color) {
    const point = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: pos
                }
            }
        ]
    };
    if (map.getLayer(id)) {
        map.getSource(id).setData(id);
    } else {
        map.addLayer({
            id: id,
            type: 'circle',
            source: {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'Point',
                                coordinates: to
                            }
                        }
                    ]
                }
            },
            paint: {
                'circle-radius': 10,
                'circle-color': color
            }
        });
    }
}

function generaPercorso() {
    const from = (document.getElementById('from').value).split(',');
    const to = (document.getElementById('to').value).split(',');

    getRoute(from, to);
    setPoint(from, 'start', '#1e8aa5');
    setPoint(to, 'end', '#f30');
}*/