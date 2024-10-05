// Funktion, um das Bild und den Text an GitHub Actions zu senden
async function sendPromptToGitHubActions(imageBase64, textPrompt) {
    try {
        // GitHub Actions API-Aufruf, um den Workflow zu starten
        const response = await fetch('https://api.github.com/repos/diggerla2000/bildalttexter/actions/workflows/chatgpt.yml/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',  // Ersetze durch dein GitHub-Personal-Access-Token
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
            return "Fehler beim Senden der Anfrage.";
        }
    } catch (error) {
        console.error('Fehler beim Senden der Anfrage an GitHub Actions:', error);
        return 'Fehler beim Senden der Anfrage an GitHub Actions.';
    }
}

// Funktion, um die Bilddaten in Base64 zu konvertieren und an GitHub Actions zu senden
document.getElementById('sendPromptBtn').addEventListener('click', async () => {
    const textPrompt = "This is the text you want to send along with the image."; // Passe dies dynamisch an
    const imageUrl = 'path/to/your/image.png'; // Ersetze dies durch den Pfad deines Bildes

    try {
        // Hole das Bild und konvertiere es in Base64
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = async () => {
            const imageBase64 = reader.result.split(',')[1]; // Base64-String extrahieren
            const gptResponse = await sendPromptToGitHubActions(imageBase64, textPrompt);

            // Zeige die Antwort von GitHub Actions im Textbereich an
            document.getElementById('gptResponse').value = gptResponse;
        };

        reader.readAsDataURL(blob);
    } catch (error) {
        console.error('Fehler beim Laden des Bildes:', error);
        document.getElementById('gptResponse').value = 'Fehler beim Laden des Bildes.';
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
