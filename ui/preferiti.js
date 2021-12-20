const app = document.getElementById('root');

const titolo = document.createElement('h1');
titolo.textContent = "TourPath";

const table = document.createElement('table');
table.setAttribute('id', 'users');

const tableHead = document.createElement('tr');

const th1 = document.createElement('th');
th1.textContent = "ID";
const th2 = document.createElement('th');
th2.textContent = "Città";
const th3 = document.createElement('th');
th3.textContent = "Numero punti di intreresse";

app.appendChild(titolo);
app.appendChild(table);
table.appendChild(tableHead);
tableHead.appendChild(th1);
tableHead.appendChild(th2);
tableHead.appendChild(th3);

var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:50102/api/PercorsiPreferiti', true);
request.onload = function () {

    // Accesso al file JSON
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        data.percorsi.forEach(percorso => {
            const riga = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = percorso.id;
            const td2 = document.createElement('td');
            td2.textContent = percorso.citta;
            const td3 = document.createElement('td');
            td3.textContent = percorso.poi.length;

            table.appendChild(riga);
            riga.appendChild(td1);
            riga.appendChild(td2);
            riga.appendChild(td3);
        });
    } else {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = `THE API IS NOT WORKING!`;
        app.appendChild(errorMessage);
    }
}

request.send();

function aggiungipremium(){
    window.location.href = 'formNuovoUtente.html';
}

function toMappa(){
    window.location.href = 'MapBox.html';
}

function toAccount(){
    window.location.href = 'testUtenti.html';
}