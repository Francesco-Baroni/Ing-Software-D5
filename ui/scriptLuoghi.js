const app = document.getElementById('root');

const titolo = document.createElement('h1');
titolo.textContent = "TourPath";

const logo = document.createElement('img');
logo.src = 'logo.png';

const btnCerca = document.createElement('button');
btnCerca.setAttribute('class', 'button btnCerca');
btnCerca.onclick = function () { cercaComune() };
btnCerca.textContent = "Cerca";

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
app.appendChild(btnCerca);
app.appendChild(table);
table.appendChild(tableHead);
tableHead.appendChild(th1);
tableHead.appendChild(th2);
tableHead.appendChild(th3);

function cercaComune() {
    var comune = document.getElementById('nomeComune').value;
    var url = 'http://localhost:50102/api/PuntiInteresse/' + comune;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        // Begin accessing XML data here
        let data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            table.innerHTML = "";
            table.appendChild(tableHead);
            data["mibac-list"]["mibac"].forEach(luogo => {
                const riga = document.createElement('tr');

                const td1 = document.createElement('td');
                td1.textContent = luogo["luogodellacultura"][0].denominazione[0].nomestandard;
                const td2 = document.createElement('td');
                td2.textContent = luogo["luogodellacultura"][0].descrizione[0].testostandard;
                const td3 = document.createElement('td');
                const img = document.createElement('img');
                if(luogo["luogodellacultura"][0].allegati[0] != ""){
                    img.setAttribute('src', luogo["luogodellacultura"][0].allegati[0].allegato[0].url);
                    
                }
                else{
                    img.setAttribute('src', 'noImg.png');
                }
                
                td3.appendChild(img);
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
    //window.location.href = url;
}