import AppConfig from "./config/config";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureScreenshot') {
    console.log(chrome.windows.WINDOW_ID_CURRENT);
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const targetTab = tabs.find(tab => tab.url?.includes(AppConfig.TargetTabDomain));
      if (targetTab) {
        chrome.tabs.captureVisibleTab(targetTab.windowId, { format: 'png' }, (dataUrl) => {
          if (chrome.runtime.lastError) {
            console.error('Error capturing screenshot:', chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError });
          } else {
            sendResponse({ success: true, screenshot: dataUrl });
          }
        });
      } else {
        console.error('No target tab found in the current window.');
      }
    });
    return true; // Keep the message channel open for async response
  }
});