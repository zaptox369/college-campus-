export function connectWebSocket(onMessage: (data: any) => void) {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000/ws/occupancy";
  let socket: WebSocket | null = null;
  let reconnectTimeout: any = null;

  function init() {
    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected to Digital Twin Campus server");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      socket.onerror = (error) => {
        console.warn("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed. Attempting reconnect in 3s...");
        reconnectTimeout = setTimeout(init, 3000);
      };
    } catch (err) {
      console.error("WebSocket init error:", err);
      reconnectTimeout = setTimeout(init, 5000);
    }
  }

  init();

  return () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (socket) socket.close();
  };
}
