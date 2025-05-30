(() => {
    // Create a floating button
    const button = document.createElement("button");
    button.innerText = "AI Scan";
    button.id = "ai-scan-btn";
    Object.assign(button.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: "9999",
        padding: "10px 15px",
        fontSize: "16px",
        backgroundColor: "#6200ee",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
    } as Partial<CSSStyleDeclaration>);

    document.body.appendChild(button);

    // On click, trigger screenshot
    button.onclick = () => {
        chrome.runtime.sendMessage({ action: "capture" });
    };

    // Define type for boxes
    type Box = {
        box: [number, number, number, number]; // [x1, y1, x2, y2]
        label: string;
        confidence: number;
    };

    // Listen for draw command
    chrome.runtime.onMessage.addListener((msg: { action: string; boxes?: Box[] }) => {
        if (msg.action === "draw" && msg.boxes) {
            const canvas = document.createElement("canvas");
            canvas.style.position = "fixed";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.zIndex = "9998";
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.font = "16px Arial";
            ctx.fillStyle = "red";

            msg.boxes.forEach((box) => {
                const [x1, y1, x2, y2] = box.box;
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                ctx.fillText(`${box.label} (${box.confidence.toFixed(2)})`, x1, y1 - 5);
            });
        }
    });
})();
