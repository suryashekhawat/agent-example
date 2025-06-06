const AppConfig = {
    WebSocket: {
        url: "ws://localhost:8080/ws",
        retryInterval: 2000, // Retry every 2 seconds
    },
    ExtensionID: "dgmfcoebneheppidbplbfhcmkbodooaj",
} as const;

export default AppConfig;