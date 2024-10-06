const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// Zugriff auf die Umgebungsvariable GITHUB_PAT (Config Var auf Heroku)
const GITHUB_PAT = process.env.GITHUB_PAT;  // Heroku stellt diese Umgebungsvariable bereit

app.post('/send-to-github-actions', async (req, res) => {
    const { imageBase64, textPrompt } = req.body;

    try {
        // Verwende die GitHub API, um den Workflow zu starten
        const response = await fetch('https://gawelskitools.github.io/bildalttexter/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_PAT}`,  // Verwende die Umgebungsvariable aus den Config Vars
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: 'workflows',  // Der Branch, auf dem der Workflow ausgeführt wird
                inputs: {
                    prompt: textPrompt,
                    imageData: imageBase64
                }
            })
        });

        // Erfolgreiche Antwort von GitHub
        if (response.ok) {
            res.json({ message: 'Anfrage erfolgreich gesendet!' });
        } else {
            res.status(response.status).json({ message: `Fehler beim Senden der Anfrage. Status: ${response.status}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler beim Senden der Anfrage.', error: error.toString() });
    }
});

// Startet den Server auf Heroku's Port oder einem lokalen Port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
