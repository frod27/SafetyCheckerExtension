chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.action === "extractAndCheckUrls") {
        const urls = extractUrls();
        if (urls.length > 0) {
            chrome.runtime.sendMessage({action: "checkUrls", urls: urls}, sendResponse);
        }
        return true; // Indicates an asynchronous response
    }
});

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
            // Handle the response here. You can, for example, mark unsafe links on the page.
            console.log('Safety Check Results:', response.safeBrowsingResult);
        } else {
            console.error('Error in getting safety check results');
        }
    });
}

// Extract and check URLs when the page is loaded
window.addEventListener('load', () => {
    const urls = extractUrls();
    if (urls.length > 0) {
        checkUrlsSafety(urls);
    }
});
