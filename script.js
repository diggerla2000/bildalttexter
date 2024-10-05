// Function to get the OpenAI response
async function sendPromptToGPT(imageBase64, textPrompt) {
    const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key
    const apiEndpoint = 'https://api.openai.com/v1/completions';

    try {
        // Prepare the payload for OpenAI API
        const requestBody = {
            model: 'gpt-3.5-turbo', // You can adjust the model as needed
            prompt: `${textPrompt}\nImage: ${imageBase64}`,
            max_tokens: 100,
            temperature: 0.7
        };

        // Make the API request to OpenAI
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        return data.choices[0].text; // Get the response text from OpenAI

    } catch (error) {
        console.error('Error fetching the GPT response:', error);
        return 'Error fetching the GPT response.';
    }
}

// Function to handle the button click event
document.getElementById('sendPromptBtn').addEventListener('click', async () => {
    const textPrompt = "This is the text you want to send along with the image."; // Replace this with dynamic input
    const imageUrl = 'path/to/your/image.png'; // Replace with your image path

    // Convert image to Base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = async () => {
        const imageBase64 = reader.result.split(',')[1]; // Get Base64 string from the result
        const gptResponse = await sendPromptToGPT(imageBase64, textPrompt);
        
        // Show GPT response in the textarea
        document.getElementById('gptResponse').value = gptResponse;
    };
    reader.readAsDataURL(blob);
});

// Function to copy the GPT response to the clipboard
document.getElementById('copyResponseBtn').addEventListener('click', () => {
    const gptResponse = document.getElementById('gptResponse').value;

    // Copy to clipboard
    navigator.clipboard.writeText(gptResponse)
        .then(() => {
            alert('Response copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy response: ', err);
        });
});
