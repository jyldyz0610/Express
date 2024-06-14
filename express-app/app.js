// Importiere benötigte Module
const express = require('express');
const morgan = require('morgan');

// Erstelle eine Express-App
const app = express();

// Middleware für Logging mit Morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Middleware für das Servieren statischer Dateien
app.use(express.static('public'));

// Routen definieren
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/data', (req, res) => {
    res.send('Data Page (GET)');
});

app.post('/data', (req, res) => {
    res.send('Data Page (POST)');
});

app.put('/data', (req, res) => {
    res.send('Data Page (PUT)');
});

app.delete('/data', (req, res) => {
    res.send('Data Page (DELETE)');
});

// Route, um einen Fehler zu provozieren (zum Testen der Fehlerbehandlung)
app.get('/error', (req, res) => {
    throw new Error('Forced error');
});

// Middleware für 404 Fehler (Ressource nicht gefunden)
app.use((req, res, next) => {
    res.status(404).send('Resource not found');
});

// Middleware für zentrale Fehlerbehandlung
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

