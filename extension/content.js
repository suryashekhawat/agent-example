(function () {
  // Create a floating button
  const button = document.createElement("button");
  button.innerText = "AI Scan";
  button.id = "ai-scan-btn";
  Object.assign(button.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: 9999,
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#6200ee",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  });

  // Add to the page
  document.body.appendChild(button);

  // On click, capture and send to backend
  button.onclick = () => {
    chrome.runtime.sendMessage({ action: "capture" });
  };

  // Listen for detection results and draw boxes
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "draw") {
      const canvas = document.createElement("canvas");
      canvas.style.position = "fixed";
      canvas.style.top = 0;
      canvas.style.left = 0;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.zIndex = 9998;
      document.body.appendChild(canvas);

      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.font = "16px Arial";
      ctx.fillStyle = "red";

      msg.boxes.forEach((box) => {
        const [x1, y1, x2, y2] = box.box;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillText(`${box.label} (${box.confidence})`, x1, y1 - 5);
      });
    }
  });
})();
