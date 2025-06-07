const AppConfig = {
    WebSocket: {
        url: "ws://localhost:8080/ws",
        retryInterval: 2000, // Retry every 2 seconds
    },
    ExtensionID: "dgmfcoebneheppidbplbfhcmkbodooaj",
    mode: "development",
    TargetTabDomain: "github.com",
    updatePageDuration: 10000, // Update page every 10 second
} as const;

export default AppConfig;