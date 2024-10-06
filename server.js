'https://gawelskitools.github.io/bildalttexter/'
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // CORS-Modul importieren

const app = express();

// CORS-Konfiguration: Erlaube Anfragen von 'https://gawelskitools.github.io'
app.use(cors({
    origin: 'https://gawelskitools.github.io'
}));

app.use(express.json());

const GITHUB_PAT = process.env.GITHUB_PAT; // GitHub PAT von Heroku Config Vars

app.post('/send-to-github-actions', async (req, res) => {
    const { imageBase64, textPrompt } = req.body;

    try {
        // Anfrage an die GitHub API senden, um den Workflow auszulösen
        const response = await fetch('https://api.github.com/repos/gawelskitools/bildalttexter/workflows/chatgpt.yml/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_PAT}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ref: 'main',
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

// Starte den Server auf einem Port (von Heroku zugewiesen oder 3000 lokal)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
