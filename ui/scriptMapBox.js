mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNlc2NvLWJhcm9uaSIsImEiOiJja3dybnUxY2gweTNoMzJxb3R6dGFxaDlwIn0.pkOvW-8R444cL5Wwks_teQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [11.13, 46.07], // starting position
    zoom: 12
});

const start = [11.13, 46.07];
const end = [11.13, 46.05];

function getPath(start, end) {
    let id = 0;
    setPoint(start, 'start', '#2d8f53');
    setPoint(end, 'end', '#f30');
    let path = `${start[0]},${start[1]};`;

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:50102/api/percorsoAttivo', true);
    request.onload = function() {
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.poi.forEach(p => {
                path += `${p[0]},${p[1]};`
                let pos = [p[0], p[1]];
                setPoint(pos, "p" + id, '#33a7e0');
                id++;
            });
        }
        path += `${end[0]},${end[1]}`;
    }
    request.onloadend = function() {
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

function setPoint(pos, id, color) {
    const point = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: pos
            }
        }]
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
                    features: [{
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: pos
                        }
                    }]
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
}