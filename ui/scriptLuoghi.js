const app = document.getElementById('root');

const titolo = document.createElement('h1');
titolo.textContent = "TourPath";

const logo = document.createElement('img');
logo.src = 'logo.png';

const btnAdd = document.createElement('button');
btnAdd.setAttribute('class', 'button btnAdd');
btnAdd.onclick = function () { cercaComune() };
btnAdd.textContent = "Cerca";

const inputComune = document.createElement('input');
inputComune.setAttribute('type', 'text');
inputComune.setAttribute('id', 'nomeComune');

const table = document.createElement('table');
table.setAttribute('id', 'users');

const tableHead = document.createElement('tr');

const th1 = document.createElement('th');
th1.textContent = "Nome";
const th2 = document.createElement('th');
th2.textContent = "Descrizione";
const th3 = document.createElement('th');
th3.textContent = "Immagine";

app.appendChild(logo);
app.appendChild(titolo);
app.appendChild(inputComune);
app.appendChild(btnAdd);
app.appendChild(table);
table.appendChild(tableHead);
tableHead.appendChild(th1);
tableHead.appendChild(th2);
tableHead.appendChild(th3);

function cercaComune() {
    var request = new XMLHttpRequest();
    var comune = document.getElementById('nomeComune').value;
    var url = 'https://opendata.beniculturali.it/searchPlace?modulo=luoghi&comune=' + comune;
    request.open('GET', url, true);
    request.setRequestHeader('Access-Control-Allow-Headers', '*');
    request.setRequestHeader('Access-Control-Allow-Origin', 'anonymous');
    request.setRequestHeader("Authorization", "Basic GET");
    request.onload = function () {

        // Begin accessing XML data here
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(this.response, "text/xml");
        if (request.status >= 200 && request.status < 400) {
            for (let i = 0; i < xmlDoc.getElementsByTagName('mibac').length; i++) {
                const riga = document.createElement('tr');

                const td1 = document.createElement('td');
                td1.textContent = x[i].getElementsByTagName('luogodellacultura').getElementsByTagName('denominazione')[0].nodeValue;
                const td2 = document.createElement('td');
                td2.textContent = x[i].getElementsByTagName('luogodellacultura').getElementsByTagName('descrizione')[0].nodeValue;
                const td3 = document.createElement('td');
                td3.textContent = x[i].getElementsByTagName('luogodellacultura').getElementsByTagName('allegati')[0].childNodes[0].nodeValue;

                table.appendChild(riga);
                riga.appendChild(td1);
                riga.appendChild(td2);
                riga.appendChild(td3);
            }
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `THE API IS NOT WORKING!`;
            app.appendChild(errorMessage);
        }
    }

    request.send();
}