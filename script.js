// Funktion, um das Bild und den Text an GitHub Actions zu senden
async function sendPromptToGitHubActions(imageBase64, textPrompt) {
    try {
        // GitHub Actions API-Aufruf, um den Workflow zu starten
        const response = await fetch('https://api.github.com/repos/diggerla2000/bildalttexter/blob/workflows/chatgpt.yml/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',  // Füge hier deinen echten GitHub-Personal-Access-Token ein
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
            return "Anfrage erfolgreich gesendet! Die Antwort wird bald hier angezeigt.";
        } else {
            return `Fehler beim Senden der Anfrage. Status: ${response.status}`;
        }
    } catch (error) {
        console.error('Fehler beim Senden der Anfrage an GitHub Actions:', error);
        return 'Fehler beim Senden der Anfrage an GitHub Actions.';
    }
}

// Funktion, um die Bilddaten in Base64 zu konvertieren und an GitHub Actions zu senden
document.getElementById('sendPromptBtn').addEventListener('click', async () => {
    const textPrompt = document.getElementById('textPrompt').value || "Dies ist der Standardtext für den Prompt."; // Passe dies dynamisch an
    const imageInput = document.getElementById('imageInput'); // Verwende einen File-Input für das Bild

    if (!imageInput.files.length) {
        alert('Bitte zuerst ein Bild auswählen.');
        return;
    }

    const file = imageInput.files[0];

    try {
        // Bild konvertieren in Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageBase64 = reader.result.split(',')[1]; // Base64-String extrahieren
            const gptResponse = await sendPromptToGitHubActions(imageBase64, textPrompt);

            // Zeige die Antwort von GitHub Actions im Textbereich an
            document.getElementById('gptResponse').value = gptResponse;
        };

        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Fehler beim Verarbeiten des Bildes:', error);
        document.getElementById('gptResponse').value = 'Fehler beim Verarbeiten des Bildes.';
    }
});

// Funktion zum Kopieren der GPT-Antwort in die Zwischenablage
document.getElementById('copyResponseBtn').addEventListener('click', () => {
    const gptResponse = document.getElementById('gptResponse').value;

    // Kopiere den Text in die Zwischenablage
    navigator.clipboard.writeText(gptResponse)
        .then(() => {
            alert('Antwort in die Zwischenablage kopiert!');
        })
        .catch(err => {
            console.error('Fehler beim Kopieren der Antwort:', err);
        });
});
