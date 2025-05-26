document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://localhost:8000");

  socket.addEventListener("open", () => {
    console.log("WebSocket connection established.");
  });

  socket.addEventListener("message", (event) => {
    console.log("Message from server:", event.data);
    // Handle incoming messages here
  });

  socket.addEventListener("close", () => {
    console.log("WebSocket connection closed.");
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Example: Sending a message to the server
  document.getElementById("sendButton").addEventListener("click", () => {
    const message = document.getElementById("messageInput").value;
    socket.send(message);
  });
});
