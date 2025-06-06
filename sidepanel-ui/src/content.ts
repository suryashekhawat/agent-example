// content.js
import { useStreamStore } from '@/store/streamStore';

type ElementData = Element & {
  innerText: string;
}

function getElementsData() {
  const elements: NodeListOf<Element> = document.querySelectorAll("*");
  return Array.from(elements)
    .filter(el => {
      const rect = el.getBoundingClientRect();
      // Check if the element is visible
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top >= 0 &&
        rect.left >= 0 &&
        (el as HTMLElement).offsetParent !== null // Ensure the element is not hidden (e.g., `display: none`)
      );
    })
    .map(el => {
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        text: (el as HTMLElement).innerText,
        boundingBox: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        }
      };
    });
}

async function updatePageData() {
  const boundingBoxes = getElementsData();
  const screenshotImageBase64 = await captureScreenshot();
  const pageData = {
    url: window.location.href,
    title: document.title,
    boundingBoxes,
    screenshotImageBase64,
  };

  // Update the Zustand store
  useStreamStore.setState({ page: pageData });
}

async function captureScreenshot(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'captureScreenshot' }, (response) => {
      if (response.success) {
        resolve(response.screenshot); // Base64-encoded screenshot
      } else {
        console.error('Error capturing screenshot:', response.error);
        reject(new Error(response.error));
      }
    });
  });
}

// Update the page data in the store
setInterval(updatePageData, 5000); // Update every 5 seconds