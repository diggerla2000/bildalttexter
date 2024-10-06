// Funktion, um Bild und Text an den Backend-Server auf Heroku zu senden
async function sendToChatGpt() {
    const fileInput = document.getElementById('imageInput'); // Dateiinput-Element
    const gptResponseField = document.getElementById('gptResponse'); // Textbereich für die Antwort
    const textPrompt = document.getElementById('textPrompt').value || "Bildbeschreibung mit maximal 150 Zeichen."; // Text-Prompt

    // Prüfen, ob ein Bild hochgeladen wurde
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]; // Die hochgeladene Bilddatei

        // Bild in Base64 umwandeln
        const reader = new FileReader();
        reader.onloadend = async function () {
            const imageBase64 = reader.result.split(',')[1]; // Base64-String extrahieren

            // Anfrage an den Heroku-Backend-Server senden
            try {
                const response = await fetch('https://gawelskitools-558e7e76c43a.herokuapp.com/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageBase64: imageBase64,
                        textPrompt: textPrompt
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    gptResponseField.value = result.message; // Zeige die Antwort an
                } else {
                    gptResponseField.value = `Fehler beim Senden der Anfrage. Status: ${response.status}`;
                }
            } catch (error) {
                gptResponseField.value = `Serverfehler: ${error}`;
            }
        };

        reader.readAsDataURL(file); // Datei lesen und in Base64 umwandeln
    } else {
        alert('Bitte zuerst ein Bild auswählen.');
    }
}

// Funktion, um den Prompt in die Zwischenablage zu kopieren
function copyPromptToClipboard() {
    const promptText = document.getElementById('textPrompt').value;
    navigator.clipboard.writeText(promptText).then(function() {
        alert('Prompt kopiert!');
    }).catch(function() {
        alert('Fehler beim Kopieren des Prompts.');
    });
}

// Funktion, um die GPT-Antwort in die Zwischenablage zu kopieren
function copyGptResponseToClipboard() {
    const gptResponse = document.getElementById('gptResponse').value;
    navigator.clipboard.writeText(gptResponse).then(function() {
        alert('Antwort kopiert!');
    }).catch(function() {
        alert('Fehler beim Kopieren der Antwort.');
    });
}

// Event Listener für den Button zum Senden der Anfrage an Chat GPT
document.getElementById('sendToChatGptButton').addEventListener('click', sendToChatGpt);

// Event Listener für den Button zum Kopieren der Antwort
document.getElementById('copyResponseBtn').addEventListener('click', copyGptResponseToClipboard);

// Event Listener für den Button zum Kopieren des Prompts
document.getElementById('copyPromptBtn').addEventListener('click', copyPromptToClipboard);
