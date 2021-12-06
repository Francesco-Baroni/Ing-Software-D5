mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmNlc2NvLWJhcm9uaSIsImEiOiJja3dybnUxY2gweTNoMzJxb3R6dGFxaDlwIn0.pkOvW-8R444cL5Wwks_teQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [11.13, 46.07], // starting position
    zoom: 12
});
/*/ set the bounds of the map
const bounds = [
  [-123.069003, 45.395273],
  [-122.303707, 45.612333]
];
map.setMaxBounds(bounds);
*/
// an arbitrary start will always be the same
// only the end or destination will change
const start = [11.10, 46.00];
const end = [11.10, 46.08];



// Creazione percorso
// create a function to make a directions request
async function getRoute(start, end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    let id = 0;
    let pos = [0, 0];
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

    /*const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${path}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );*/

    const query = await fetch(
        `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${path}?roundtrip=false&source=first&destination=last&steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
    );
    const json = await query.json();
    console.log(json);
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
    getRoute(start, end);
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
});

// get the sidebar and add the instructions
const fromTo = document.getElementById('fromTo');
const inFrom = document.createElement('input');
const inTo = document.createElement('input');
const btnGenera = document.createElement('button');
const lblDurata = document.createElement('label');

inFrom.setAttribute('type', 'text');
inFrom.setAttribute('placeholder', 'From Es: 11.13, 46.07');
inFrom.setAttribute('id', 'from');

inTo.setAttribute('type', 'text');
inTo.setAttribute('placeholder', 'To Es: 11.13, 46.05');
inTo.setAttribute('id', 'to');

btnGenera.textContent = 'Genera Percorso';
btnGenera.onclick = function () { generaPercorso() };

lblDurata.setAttribute('id', 'lblDurata');

fromTo.appendChild(inFrom);
fromTo.appendChild(inTo);
fromTo.appendChild(btnGenera);
fromTo.appendChild(lblDurata);

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
}