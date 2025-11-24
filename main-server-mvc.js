const express = require("express");
const app = express();
const WebSocket = require('ws');
const http = require('http');
const routes = require('./routes');
const MessageController = require('./controllers/MessageController');
const UserController = require('./controllers/UserController');

// 프록시 뒤에서 실제 IP 가져오기 (EC2/Nginx 환경)
app.set('trust proxy', true);

app.use(express.static('.'));

// HTTP 서버 생성
const server = http.createServer(app);

// 포트 설정
const PORT = process.env.PORT || 3000;

// WebSocket 서버 생성
const webSocketServer = new WebSocket.Server({ server });

// 컨트롤러 초기화
const messageController = new MessageController(webSocketServer);
const userController = new UserController(webSocketServer);

// 라우트 설정
app.use('/', routes);

// WebSocket 연결 이벤트
webSocketServer.on('connection', (ws, req) => {
    // 실제 클라이언트 IP 가져오기 (프록시 환경 고려)
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.socket.remoteAddress ||
        ws._socket.remoteAddress;

    // 사용자 연결
    userController.connect(clientIP);
    userController.broadcastJoin();

    // 초기 메시지 전송
    ws.send(
        JSON.stringify({
            type: "init",
            messages: messageController.getInitialMessages(),
        })
    );

    // 메시지 수신
    ws.on('message', (data) => {
        try {
            const message = data.toString();
            messageController.sendMessage(message, clientIP);
        } catch (error) {
            ws.send(JSON.stringify({
                type: 'error',
                message: error.message
            }));
        }
    });

    // 연결 종료
    ws.on('close', () => {
        userController.disconnect(clientIP);
    });
});

server.listen(PORT, '172.31.66.77', () => {
    console.log(`✅ 서버 실행 중: http://0.0.0.0:${PORT}`);
    console.log(`✅ WebSocket: 같은 포트(${PORT})에서 실행`);
    console.log(`✅ MVC 패턴 적용 완료`);
    console.log(`📡 외부 접속 허용 (EC2/프로덕션 모드)`);
});
