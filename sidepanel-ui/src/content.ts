// content.js
import { useStreamStore } from '@/store/streamStore';
import AppConfig from './config/config';

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
      const computedStyle = getComputedStyle(el); // Get computed styles
      const styleArray = Array.from(computedStyle).map(property => ({
        property,
        value: computedStyle.getPropertyValue(property),
      }));
      return {
        tag: el.tagName,
        className: el.className,
        id: (el as HTMLElement).id || null,
        dataAttributes: Array.from(el.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {} as Record<string, string>),
        style: styleArray,
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


// Track mouse position and click events
function trackMouseAndClicks() {
  document.addEventListener('mousemove', (event) => {
    const mousePosition = {
      type: 'mousemove',
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
    };

    // Update the Zustand store with the mouse position
    useStreamStore.setState(state => ({
      mouseEvents: [...state.mouseEvents, mousePosition],
    }));
  });

  document.addEventListener('click', (event) => {
    const clickEvent = {
      type: 'click',
      x: event.clientX,
      y: event.clientY,
      element: (event.target as HTMLElement).tagName, // Element clicked
      timestamp: Date.now(),
    };

    // Update the Zustand store with the click event
    useStreamStore.setState(state => ({
      mouseEvents: [...state.mouseEvents, clickEvent],
    }));
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
    mouseEvents: useStreamStore.getState().mouseEvents,
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

// Initialize mouse tracking
// trackMouseAndClicks();

// Update the page data in the store
setInterval(updatePageData, AppConfig.updatePageDuration); // Update every 5 seconds