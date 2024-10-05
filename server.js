const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();  // Um den Token sicher aus der .env-Datei zu laden

const app = express();
const port = process.env.PORT || 3000;

// Middleware, um JSON-Daten zu verarbeiten
app.use(express.json());

// POST-Route für die API-Anfrage
app.post('/send-to-github-actions', async (req, res) => {
    const { imageBase64, textPrompt } = req.body;

    try {
        // GitHub Actions API-Aufruf
        const response = await fetch('https://api.github.com/repos/diggerla2000/bildalttexter/actions/workflows/chatgpt.yml/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_PAT}`,  // GitHub Token aus der .env-Datei laden
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

        if (response.ok) {
            res.json({ message: 'Anfrage erfolgreich gesendet!' });
        } else {
            res.status(response.status).json({ message: `Fehler beim Senden der Anfrage. Status: ${response.status}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler beim Senden der Anfrage.', error: error.toString() });
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
