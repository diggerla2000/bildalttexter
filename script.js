// Funktion, um Bild über FileInput zu laden
function loadImage(event) {
    const imageField = document.getElementById('imageField');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const img = document.createElement('img');
        img.src = reader.result;
        img.onload = function() {
            // Bild anzeigen im Image Field
            imageField.innerHTML = ''; // Leeren des Feldes
            imageField.appendChild(img); // Bild einfügen
        };
    };

    if (file) {
        reader.readAsDataURL(file); // Datei in Base64 konvertieren
    }
}

// Funktion, um Bild und Text an den Backend-Server zu senden
async function sendToChatGpt() {
    const fileInput = document.getElementById('fileInput');
    const gptResponseField = document.getElementById('gptResponse');
    const promptText = "Beschreibe das Bild in maximal 150 Zeichen.";

    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onloadend = async function () {
            const imageBase64 = reader.result.split(',')[1]; // Base64-String des Bildes extrahieren

            // Anfrage an den Heroku-Backend-Server senden
            try {
                const response = await fetch('https://gawelskitools-558e7e76c43a.herokuapp.com/send-to-github-actions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageBase64: imageBase64, // Bilddaten
                        textPrompt: promptText     // Der Textprompt
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    gptResponseField.value = result.message; // Antwort anzeigen
                } else {
                    gptResponseField.value = `Fehler: ${response.status}`;
                }
            } catch (error) {
                gptResponseField.value = `Serverfehler: ${error}`;
            }
        };

        reader.readAsDataURL(file); // Datei in Base64 konvertieren
    } else {
        alert('Bitte zuerst ein Bild auswählen.');
    }
}

// GPT-Antwort in die Zwischenablage kopieren
function copyGptResponseToClipboard() {
    const gptResponse = document.getElementById('gptResponse').value;
    navigator.clipboard.writeText(gptResponse).then(function() {
        alert('Antwort kopiert!');
    }).catch(function() {
        alert('Fehler beim Kopieren der Antwort.');
    });
}

// Prompt in die Zwischenablage kopieren
function copyPromptToClipboard() {
    const promptText = "Beschreibe das Bild in maximal 150 Zeichen.";
    navigator.clipboard.writeText(promptText).then(function() {
        alert('Prompt kopiert!');
    }).catch(function() {
        alert('Fehler beim Kopieren des Prompts.');
    });
}

// Event Listener für den Button zum Senden der Anfrage an Chat GPT
document.getElementById('sendToChatGptButton').addEventListener('click', sendToChatGpt);

// Event Listener für den Button zum Kopieren der Antwort
document.getElementById('copyResponseBtn').addEventListener('click', copyGptResponseToClipboard);

// Event Listener für den Button zum Kopieren des Prompts
document.getElementById('copyPromptButton').addEventListener('click', copyPromptToClipboard);
