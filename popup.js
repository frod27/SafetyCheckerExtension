document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('checkPage');
    const statusDiv = document.getElementById('status');
    checkButton.addEventListener('click', function () {
        setLoading(true);

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "checkUrls"}, function(response) {
                setLoading(false);
                if (response && Array.isArray(response.safeBrowsingResult)) {
                    updateResults(response.safeBrowsingResult);
                } else {
                    statusDiv.innerHTML = '<p>Error occurred or no results.</p>';
                }
            });
        });
    });
    function setLoading(isLoading) {
        statusDiv.innerHTML = isLoading ? '<p>Loading...</p>' : '';
    }

    function updateResults(safeBrowsingResult) {
        if (safeBrowsingResult.length > 0) {
            safeBrowsingResult.forEach(result => {
                const urlElement = document.createElement('p');
                urlElement.textContent = result.url + ' - ' + (result.safe ? 'Safe' : 'Unsafe');
                urlElement.className = result.safe ? 'safe' : 'unsafe';
                statusDiv.appendChild(urlElement);
            });
        } else {
            statusDiv.innerHTML = '<p>No threats detected or no results returned.</p>';
        }
    }

    checkButton.addEventListener('click', function () {
        setLoading(true);

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "extractAndCheckUrls"}, function(response) {
                setLoading(false);
                if (response && response.safeBrowsingResult) {
                    updateResults(response.safeBrowsingResult);
                } else {
                    statusDiv.innerHTML = '<p>Error occurred.</p>';
                }
            });
        });
    });
});
