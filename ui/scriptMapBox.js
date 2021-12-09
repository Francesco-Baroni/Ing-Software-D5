mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNlc2NvLWJhcm9uaSIsImEiOiJja3dybnUxY2gweTNoMzJxb3R6dGFxaDlwIn0.pkOvW-8R444cL5Wwks_teQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [11.13, 46.07], // starting position
    zoom: 12
});

const start = [11.13, 46.07];
const end = [11.13, 46.05];

var dataPOI;

function getPath(start, end) {
    let id = 0;
    setPoint(start, 'Inizio', '#2d8f53', './image/start.png', -2);
    setPoint(end, 'Fine', '#f30', './image/end.png', -1);
    let path = `${start[0]},${start[1]};`;

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:50102/api/percorsoAttivo', true);
    request.onload = function () {
        dataPOI = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            dataPOI.poi.forEach(p => {
                path += `${p[0]},${p[1]};`
                let pos = [p[0], p[1]];
                setPoint(pos, p["nome"], p["descrizione"], p["immagine"], id);
                id++;
            });
        }
        path += `${end[0]},${end[1]}`;
    }
    request.onloadend = function () {
        getRoute(path)
    };
    request.send();
}

// Creazione percorso
async function getRoute(path) {
    console.log(path);
    const query = await fetch(
        `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${path}?roundtrip=false&source=first&destination=last&steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
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
    getPath(start, end);
});

// get the sidebar and add the instructions
const fromTo = document.getElementById('fromTo');
//const btnGenera = document.createElement('button');
const lblDurata = document.createElement('label');

//btnGenera.textContent = 'Genera Percorso';
//btnGenera.onclick = function() { generaPercorso() };

lblDurata.setAttribute('id', 'lblDurata');

//fromTo.appendChild(btnGenera);
fromTo.appendChild(lblDurata);

function setPoint(pos, nome, descrizione, immagine, cod) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
    if (nome == 'Inizio' || nome == 'Fine') {
        el.style.backgroundImage = 'url(' + immagine + ')';
        new mapboxgl.Marker(el).setLngLat(pos).setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<h3>${nome}</h3>`
                )
        ).addTo(map);
    }
    else {
        new mapboxgl.Marker(el).setLngLat(pos).setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<div id='anteprimaPOI' onclick='dettaglioPOI(${cod})'><h3>${nome}</h3><img id='imgPOIAnteprima' src='${immagine}'></div>`
                )
        ).addTo(map);
    }
}

function dettaglioPOI(cod) {
    console.log(cod);

    const div = document.getElementById("dettaglioPOI");
    div.style.display = 'block';

    const btnEsci = document.createElement('button');
    btnEsci.setAttribute('id', 'btnEsci');
    btnEsci.onclick = function(){
        div.style.display = 'none';
    };
    btnEsci.textContent = 'X';

    const nome = document.createElement('h1');
    nome.textContent = dataPOI.poi[cod]["nome"];
    nome.setAttribute('id', 'nomePOI');

    const descrizione = document.createElement('p');
    descrizione.textContent = dataPOI.poi[cod]["descrizione"];
    descrizione.setAttribute('id', 'descrizionePOI');

    const immagine = document.createElement('img');
    immagine.setAttribute('src', dataPOI.poi[cod]["immagine"]);
    immagine.setAttribute('id', 'immaginePOI');


    const btnIntrodAudio = document.createElement('button');
    btnIntrodAudio.setAttribute('id', 'btnDetttaglioPOI');
    btnIntrodAudio.textContent = 'Audioguida introduttiva';


    const btnAudio = document.createElement('button');
    btnAudio.setAttribute('id', 'btnDetttaglioPOI');
    btnAudio.textContent = 'Audioguida completa';

    div.innerHTML = "";

    div.appendChild(btnEsci);
    div.appendChild(nome);
    div.appendChild(immagine);
    div.appendChild(descrizione);
    div.appendChild(btnIntrodAudio);
    div.appendChild(btnAudio);

    document.getElementById("dettaglioPOI").innerHTML = s;
}

function generaPercorso() {
    const from = (document.getElementById('from').value).split(',');
    const to = (document.getElementById('to').value).split(',');

    getRoute(from, to);
    setPoint(from, 'start', '#1e8aa5');
    setPoint(to, 'end', '#f30');
}