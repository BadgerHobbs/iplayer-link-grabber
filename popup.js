document.addEventListener("DOMContentLoaded", () => {
  // Get all the UI elements
  const collectUrlsBtn = document.getElementById("collectUrlsBtn");
  const copyUrlsBtn = document.getElementById("copyUrlsBtn");
  const copyScriptBtn = document.getElementById("copyScriptBtn");
  const clearUrlsBtn = document.getElementById("clearUrlsBtn");
  const urlCountSpan = document.getElementById("urlCount");
  const statusDiv = document.getElementById("status");

  // Function to update the displayed count of collected URLs
  const updateUrlCount = async () => {
    const data = await chrome.storage.local.get("collectedUrls");
    const count = data.collectedUrls ? data.collectedUrls.length : 0;
    urlCountSpan.textContent = count;
  };

  // Update the count as soon as the popup opens
  updateUrlCount();

  // Event listener for collecting URLs from the current page
  collectUrlsBtn.addEventListener("click", async () => {
    statusDiv.textContent = "Grabbing links...";
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url || !tab.url.includes("bbc.co.uk/iplayer")) {
      statusDiv.textContent = "Error: Not an iPlayer page.";
      return;
    }

    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getPageHTML,
    });

    const pageHTML = injectionResults[0].result;
    const regex = /\/iplayer\/episode\/[a-z0-9]+\/[a-z0-9-]+/g;
    const newRelativeUrls = pageHTML.match(regex);

    if (!newRelativeUrls || newRelativeUrls.length === 0) {
      statusDiv.textContent = "No new links found on this page.";
      return;
    }

    const newAbsoluteUrls = [...new Set(newRelativeUrls)].map(
      (url) => `https://www.bbc.co.uk${url}`
    );

    // Get existing URLs from storage
    const data = await chrome.storage.local.get("collectedUrls");
    const existingUrls = data.collectedUrls || [];

    // Combine, find uniques, and sort
    const combinedUrls = [
      ...new Set([...existingUrls, ...newAbsoluteUrls]),
    ].sort();

    await chrome.storage.local.set({ collectedUrls: combinedUrls });

    statusDiv.textContent = `Added ${
      combinedUrls.length - existingUrls.length
    } new URLs. Total: ${combinedUrls.length}`;
    updateUrlCount();
  });

  // Event listener for copying the URL list
  copyUrlsBtn.addEventListener("click", async () => {
    const data = await chrome.storage.local.get("collectedUrls");
    if (!data.collectedUrls || data.collectedUrls.length === 0) {
      statusDiv.textContent = "No URLs to copy.";
      return;
    }
    const outputText = data.collectedUrls.join("\n");
    await navigator.clipboard.writeText(outputText);
    statusDiv.textContent = `Copied ${data.collectedUrls.length} total URLs!`;
  });

  // Event listener for copying the yt-dlp script
  copyScriptBtn.addEventListener("click", async () => {
    const data = await chrome.storage.local.get("collectedUrls");
    if (!data.collectedUrls || data.collectedUrls.length === 0) {
      statusDiv.textContent = "No URLs to copy.";
      return;
    }
    const scriptLines = data.collectedUrls.map((url) => `yt-dlp "${url}"`);
    const outputText = scriptLines.join("\n");
    await navigator.clipboard.writeText(outputText);
    statusDiv.textContent = `Copied yt-dlp script for ${data.collectedUrls.length} URLs!`;
  });

  // Event listener for clearing the stored list
  clearUrlsBtn.addEventListener("click", async () => {
    await chrome.storage.local.remove("collectedUrls");
    statusDiv.textContent = "List cleared!";
    updateUrlCount();
  });
});

// This function is injected into the page to get its HTML
function getPageHTML() {
  return document.documentElement.outerHTML;
}
