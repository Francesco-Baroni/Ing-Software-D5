const app = document.getElementById('root');

const titolo = document.createElement('h1');
titolo.textContent = "TourPath";

const logo = document.createElement('img');
logo.src = 'logo.png';

const btnAdd = document.createElement('button');
btnAdd.setAttribute('class', 'button btnAdd');
btnAdd.onclick = function() {aggiungipremium()};
btnAdd.textContent = "Aggiungi utente premium";


const table = document.createElement('table');
table.setAttribute('id', 'users');

const tableHead = document.createElement('tr');

const th1 = document.createElement('th');
th1.textContent = "Nome";
const th2 = document.createElement('th');
th2.textContent = "Cognome";
const th3 = document.createElement('th');
th3.textContent = "Email";
const th4 = document.createElement('th');
th4.textContent = "Password";


app.appendChild(logo);
app.appendChild(titolo);
app.appendChild(btnAdd);
app.appendChild(table);
table.appendChild(tableHead);
tableHead.appendChild(th1);
tableHead.appendChild(th2);
tableHead.appendChild(th3);
tableHead.appendChild(th4);

var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:50102/api/utentiPremium', true);
request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        data.premium_users.forEach(user => {
            const riga = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = user.Nome;
            const td2 = document.createElement('td');
            td2.textContent = user.Cognome;
            const td3 = document.createElement('td');
            td3.textContent = user.Email;
            const td4 = document.createElement('td');
            td4.textContent = user.Password;

            table.appendChild(riga);
            riga.appendChild(td1);
            riga.appendChild(td2);
            riga.appendChild(td3);
            riga.appendChild(td4);
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