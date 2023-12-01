# SafetyCheckerExtension

background.js

//API Integration: This script integrates with the Google Safe Browsing API. It contains the checkUrlSafety function, which takes a list of
// URLs and checks their safety using the API.

//Message Handling: It listens for messages from the content script (content.js). Upon receiving a message with URLs to check,
//it processes these URLs through the checkUrlSafety function.
//Response Management: After receiving the API's response, background.js sends the safety results back to the sender script (usually the popup).

checkUrlSafety(urls, callback)

Purpose: Makes a request to the Google Safe Browsing API to check the safety of a list of URLs.
Parameters:
urls: An array of URLs to be checked.
callback: A function to call with the results of the API check.
Process:
Constructs a request body with the URLs.
Makes a POST request to the Google Safe Browsing API.
On success, processes the response and calls callback with the results.
On error, logs the error and calls callback with null.
Message Listener

Purpose: Listens for messages from other parts of the extension (specifically content.js).
Functionality:
Checks if the received message has an action type of "checkUrls".
Calls checkUrlSafety with the provided URLs.
Sends back the results of the safety check.

content.js

//URL Extraction: This script is responsible for extracting all unique URLs from the webpage a user is currently viewing.

//Message Sending: After extracting the URLs, content.js sends them to background.js for safety checking. 
//It uses chrome.runtime.sendMessage to send the list of URLs along with an action identifier.

//Message Listener: It also listens for messages from the popup (popup.js) to initiate the URL extraction process.


Message Listener

Purpose: Listens for messages from the popup script (popup.js).
Functionality:
On receiving a message, logs the message for debugging.
Sends a response back as a test connection string.
extractUrls()

Purpose: Extracts and returns all unique URLs from the current webpage.
Functionality:
Gathers all anchor (<a>) elements on the page.
Adds their href values to a Set (to ensure uniqueness) if they start with 'http'.
Converts the Set to an array and returns it.
checkUrlsSafety(urls)

Purpose: Sends the extracted URLs to the background script for safety checking.
Parameters:
urls: An array of URLs extracted from the page.
Functionality:
Sends a message to background.js with the URLs.
Handles the response by logging the safety check results or an error.

popup.js
//UI: This script manages the user interactions within the extension's popup window. 
//It includes event listeners, particularly for the "Check This Page" button.

//Sending and Receiving to the API: When the button is clicked, popup.js sends a message to the content script to start the URL checking process.
//It also handles responses from background.js, updating the popup with the safety results of each URL.


DOMContentLoaded Listener

Purpose: Sets up the UI functionality once the popup's DOM is fully loaded.
Functionality:
Retrieves the "Check This Page" button and status div elements.
Attaches a click event listener to the button.
setLoading(isLoading)

Purpose: Updates the UI to show a loading indicator.
Parameters:
isLoading: A boolean indicating whether to show or hide the loading indicator.
Functionality:
If isLoading is true, displays a loading message.
Otherwise, clears the status div.
updateResults(safeBrowsingResult)

Purpose: Updates the popup UI with the results of the link safety check.
Parameters:
safeBrowsingResult: An array of results from the safety check.
Functionality:
Iterates over the safeBrowsingResult array.
For each result, creates a paragraph element to display the URL and its safety status.
Button Click Event Listener

Purpose: Initiates the link safety check process.
Functionality:
Sets the loading state.
Sends a message to the content script (content.js) to start the URL extraction and safety check.
Handles the response and updates the UI with the results or an error message.
