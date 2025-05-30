chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setOptions({
      path: "dist/index.html",
      enabled: true
    });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "capture") {
      chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
        // Get active tab ID
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const tabId = tabs[0].id;
  
          fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: dataUrl.split(",")[1] })
          })
            .then(res => res.json())
            .then(data => {
              chrome.tabs.sendMessage(tabId, { action: "draw", boxes: data.detections });
            });
        });
      });
    }
  });
  