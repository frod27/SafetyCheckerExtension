
//API Connection
const API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyB4ZDi-HGpt1IQ-SmdrSbmZA4fjtRShOE8';

function checkUrlSafety(urls) {
    return new Promise((resolve, reject) => {
        let requestBody = {
            client: {
                clientId: "your_client_id", // Replace with your actual client ID
                clientVersion: "1.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
                platformTypes: ["WINDOWS"],
                threatEntryTypes: ["URL"],
                threatEntries: urls.map(url => ({url: url}))
            }
        };

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Log the successful API response
            resolve(data.matches || []);
        })
        .catch(error => {
            console.error('Error checking URL safety:', error);
            reject(error); // Reject the promise with the error
        });

        // Optional: Set a timeout for the API call
        setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 seconds timeout
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkUrls") {
        checkUrlSafety(request.urls)
            .then(result => sendResponse({safeBrowsingResult: result}))
            .catch(error => sendResponse({error: error.message}));

        return true; // Indicate that response will be sent asynchronously
    }
});
