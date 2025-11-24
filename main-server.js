// const express = require("express");
// const app = express();
// const WebSocket = require('ws');

// app.use(express.static('.'));

// // WebSocket 서버 생성 (포트 8081)
// const webSocketServer = new WebSocket.Server({ port: 8081 });

// // 브로드캐스트 함수
// function broadcastMessage(type, message) {
//     webSocketServer.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(
//                 JSON.stringify({
//                     type: type,
//                     message: message,
//                 })
//             );
//         }
//     });
// }

// // WebSocket 연결 이벤트
// webSocketServer.on('connection', (ws, req) => {
//     // 실제 클라이언트 IP 가져오기 (프록시 환경 고려)
//     const clientIP = req.headers['x-forwarded-for']?.split(',')[0] ||
//         req.headers['x-real-ip'] ||
//         req.socket.remoteAddress ||
//         ws._socket.remoteAddress;
//     console.log(`[${new Date().toISOString()}] CONNECT | IP: ${clientIP}`);

//     // 입장 메시지 브로드캐스트
//     const joinMessage = `New user join! :  Current Users : ${webSocketServer.clients.size} `;
//     broadcastMessage("join", joinMessage);

//     // 메시지 받으면
//     ws.on('message', (data) => {
//         const message = data.toString();
//         console.log(
//             `[${new Date().toISOString()}] MESSAGE | IP: ${clientIP.replace(/\.\d+$/, '.***')} | MSG: ${message}`
//         );

//         // 입력 검증: 길이 제한 (500자)
//         if (message.length > 500) {
//             ws.send(JSON.stringify({ type: 'error', message: '메시지가 너무 깁니다 (500자 이내).' }));
//             return;
//         }

//         // 메시지 저장
//         // messages.push(message);

//         // 모든 연결된 클라이언트에게 브로드캐스트
//         broadcastMessage("new", message);
//     });

//     // 연결 종료
//     ws.on('close', () => {
//         const joinMessage = `Someone left. :  Current Users : ${webSocketServer.clients.size} `;
//         broadcastMessage("left", joinMessage);

//         console.log(
//             `[${new Date().toISOString()}] DISCONNECT | IP: ${clientIP}`
//         );
//     });
// });

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

// app.listen(8080, '0.0.0.0', () => {
//     console.log("✅ HTTP 서버: http://0.0.0.0:8080");
//     console.log("✅ WebSocket 서버: ws://localhost:8081");
//     console.log("📡 외부 접속 허용 (EC2/프로덕션 모드)");
// });