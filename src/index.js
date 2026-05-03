/**
 * EDtunnel - A Cloudflare Worker-based VLESS Proxy with WebSocket Transport
 * ... (комментарии можно оставить как есть) ...
 */

// @ts-ignore
import { connect } from 'cloudflare:sockets';
import { handleRequest } from './handlers/main.js';

export default {
	async fetch(request, env, ctx) {
		// 🧪 TEST MARKER - автоматизация работает, если эта строка есть в логах
		console.log(`[AUTO-TEST] Deployed at ${new Date().toISOString()} | Path: ${new URL(request.url).pathname}`);
		
		return handleRequest(request, env, ctx, connect);
	}
};
