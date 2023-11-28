const API_KEY = 'AIzaSyB4ZDi-HGpt1IQ-SmdrSbmZA4fjtRShOE8';
const API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + API_KEY;

// Function to check URLs with the Google Safe Browsing API
function checkUrlSafety(urls, callback) {
    // Define the request body
    let requestBody = {
        client: {
            clientId: "niidadbpobgjgfpmgkoodenblopeodcj",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["WINDOWS"],
            threatEntryTypes: ["URL"],
            threatEntries: urls.map(url => ({url: url}))
        }
    };

    // Make the API request
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        const resultsArray = data.matches || []; // Assuming the API response has a 'matches' array
        callback(resultsArray);
    })
    .catch(error => {
        console.error('Error checking URL safety:', error);
        callback([]);
    });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractAndCheckUrls") {
        checkUrlSafety(request.urls, (result) => {
            sendResponse({safeBrowsingResult: result});
        });
        return true; // Indicate that response will be sent asynchronously
    }
});

