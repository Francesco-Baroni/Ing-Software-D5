# Ing-Software-D5
Documento D5

Per fare andare la pagina index.html:
- Da terminale posizionarsi nella cartella api ed eseguire il comando npm start
- Aprire il file index.html nella cartella ui

    > Nota: Nella pagina dovrebbe comparire una tabella con alcuni utenti premium ed un bottone aggiungi utente premium che non ho ancora implementato.
      Qesta pagina mi serviva solo per verificare le api in modo carino.

Per testare le api da postMan eseguire da terminale npm start, successivamente in postMan:
- Per la get: http://localhost:50102/api/utentiPremium
- Per la post: http://localhost:50102/api/newPremium

    > Nota per la post: vanno messi dei dati, sotto la post cliccare su body poi selezionare x-www-form-urlencoded ed inserire i dati.
      Le key saranno: Nome, Cognome, Email e Password. Mentre value mettete quello che volete.
 
