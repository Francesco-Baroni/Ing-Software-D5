//Token personale per accedere ai servizi di MapBox
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNlc2NvLWJhcm9uaSIsImEiOiJja3dybnUxY2gweTNoMzJxb3R6dGFxaDlwIn0.pkOvW-8R444cL5Wwks_teQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [12.674297, 42.6384261], //Posizione iniziale della mappa: Italia
    zoom: 5
});

const start = [11.13, 46.07];
const end = [11.13, 46.05];

var dataPOI;

//Quando la mappa è stata caricata, visualizza il percorso su di essa
map.on('load', () => {
    getPath(start, end);
});


//Visualizza il percoso sulla mappa
function getPath(start, end) {
    let id = 0;
    let path = "";

    //Richiesta alle API il percorso attivo (che è salvato nel file JSON)
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:50102/api/percorsoAttivo', true);
    request.onload = async function () {
        dataPOI = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            start = dataPOI.start[0];
            path += `${start[0]},${start[1]};`;

            dataPOI.poi.forEach(p => {
                path += `${p[0]},${p[1]};`
                let pos = [p[0], p[1]];
                setPoint(pos, p["nome"], p["immagine"], id);
                id++;
            });
        }

        //Se non è presente una fine, utilizza l'inizio del percorso anche come fine
        if (dataPOI.end[0] != null) {
            end = dataPOI.end[0];
            path += `${end[0]},${end[1]}`;
            setPoint(start, 'Inizio', './image/start.png', -2);
            setPoint(end, 'Fine', './image/end.png', -1);
        } else {
            end = dataPOI.start[0];
            path += `${start[0]},${start[1]}`;
            setPoint(start, 'Inizio-Fine', './image/start.png', -2);
        }
    }


    request.onloadend = async function () {
        //Crea il percorso
        getRoute(path);

        //Centra la mappa sulla città selezionata
        const queryC = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/Italia%20${dataPOI.citta}.json?limit=1&access_token=${mapboxgl.accessToken}`, { method: 'GET' }
        );
        let cordC = [2];
        const jsonC = await queryC.json();
        cordC[0] = jsonC.features[0].geometry.coordinates[0];
        cordC[1] = jsonC.features[0].geometry.coordinates[1];

        map.flyTo({
            center: cordC,
            zoom: 12
        });
    };

    request.send();
}

// Creazione percorso
async function getRoute(path) {

    //Genera il percorso più corto con i POI selezionati
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

    if (map.getSource('route')) {
        map.getSource('route').setData(geojson);
    }
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
    const lblDurata = document.getElementById('lblDurata');
    const durata = Math.floor(data.duration / 60);
    lblDurata.textContent = 'Durata: ' + durata + ' min';
}

const fromTo = document.getElementById('fromTo');
const lblDurata = document.createElement('label');

lblDurata.setAttribute('id', 'lblDurata');
fromTo.appendChild(lblDurata);

//Segna i punti sulla mappa, tramite la posizione
function setPoint(pos, nome, immagine, cod) {
    const el = document.createElement('div');
    el.className = 'marker';
    if (nome == 'Inizio' || nome == 'Fine' || nome == "Inizio-Fine") {
        el.style.backgroundImage = 'url(' + immagine + ')';
        new mapboxgl.Marker(el).setLngLat(pos).setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(
                    `<h3>${nome}</h3>`
                )
        ).addTo(map);
    }
    else {
        new mapboxgl.Marker(el).setLngLat(pos).setPopup(
            new mapboxgl.Popup({ offset: 25 })
                .setHTML(
                    `<div id='anteprimaPOI' onclick='dettaglioPOI(${cod})'><h3>${nome}</h3><img id='imgPOIAnteprima' src='${immagine}'></div>`
                )
        ).addTo(map);
    }
}

//Apre la schermata di dettaglio di un POI
function dettaglioPOI(cod) {

    const div = document.getElementById("dettaglioPOI");
    div.style.display = 'block';

    const btnEsci = document.createElement('button');
    btnEsci.setAttribute('id', 'btnEsci');
    btnEsci.onclick = function () {
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
}