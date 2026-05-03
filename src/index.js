/**
 * ✅ Minimal Stable Worker - No Imports, No Dependencies
 * Тестирует только инфраструктуру: соединение, UUID, WebSocket
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. Health check (всегда работает)
    if (url.pathname === "/status" || url.pathname === "/") {
      return new Response("✅ Worker is ALIVE - Minimal Version", { 
        status: 200,
        headers: { "Content-Type": "text/plain" }
      });
    }
    
    // 2. WebSocket echo test (без парсинга VLESS)
    if (url.pathname === "/proxy" && request.headers.get("Upgrade") === "websocket") {
      try {
        const { 0: client, 1: server } = new WebSocketPair();
        server.accept();
        
        // Просто возвращаем данные обратно (эхо-режим)
        server.addEventListener("message", (event) => {
          if (server.readyState === WebSocket.OPEN) {
            server.send(event.data);
          }
        });
        
        server.addEventListener("close", () => {
          console.log("[WS] Connection closed");
        });
        
        server.addEventListener("error", (err) => {
          console.error("[WS] Error:", err);
        });
        
        return new Response(null, {
          status: 101,
          webSocket: client,
        });
        
      } catch (err) {
        console.error("[WS] Handler error:", err);
        return new Response("WebSocket Error", { status: 500 });
      }
    }
    
    // 3. Всё остальное — 404
    return new Response("Not Found: Use /status or /proxy", { status: 404 });
  }
};

