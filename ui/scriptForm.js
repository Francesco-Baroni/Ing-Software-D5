window.addEventListener("load", function () {
    function sendData() {
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:50102/api/newPremium";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Se va a buon fine
        xhr.addEventListener("load", function (event) {
            alert(event.target.responseText);
        });

        // Se fallisce
        xhr.addEventListener("error", function (event) {
            alert('Oops! Something went wrong.');
        });

        // I dati sono presi dal form
        var nome = document.getElementById("Nome").value;
        var cognome = document.getElementById("Cognome").value;
        var email = document.getElementById("Email").value;
        var password = document.getElementById("Password").value;
        var data = JSON.stringify({ "Nome": nome, "Cognome": cognome, "Email": email, "Password": password });
        xhr.send(data);
    }

    // Accediamo al form...
    const form = document.getElementById("formPremium");

    // ...e aspettiamo che faccia la submit
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        sendData();
        window.location.href = 'index.html';
    });
});