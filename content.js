function extractUrls() {
    const urls = new Set();
    const anchors = document.getElementsByTagName('a');
    for (const anchor of anchors) {
        if (anchor.href.startsWith('http')) {
            urls.add(anchor.href);
        }
    }
    return Array.from(urls);
}

// Send URLs to background.js for checking
function checkUrlsSafety(urls) {
    chrome.runtime.sendMessage({action: "checkUrls", urls: urls}, response => {
        if (response && response.safeBrowsingResult) {
            // Handle the response here.
            console.log('Safety Check Results:', response.safeBrowsingResult);
        } else {
            console.error('Error in getting safety check results');
        }
    });
}
window.addEventListener('load', () => {
    const urls = extractUrls();
    if (urls.length > 0) {
        checkUrlsSafety(urls);
    }
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.action === "checkUrls") {
        const urls = extractUrls();
        if (urls.length > 0) {
            chrome.runtime.sendMessage({action: "checkUrls", urls: urls}, sendResponse);
        } else {
            sendResponse({}); // Send empty response if no URLs
        }
        return true; // Asynchronous response or else it will break!
    }
});