const MessageModel = require('../models/Message');
const UserModel = require('../models/User');

class MessageController {
    constructor(webSocketServer) {
        this.wss = webSocketServer;
    }

    // 메시지 검증
    validateMessage(message) {
        if (!message || typeof message !== 'string') {
            return { valid: false, error: '유효하지 않은 메시지입니다.' };
        }

        if (message.length > 500) {
            return { valid: false, error: '메시지가 너무 깁니다 (500자 이내).' };
        }

        return { valid: true };
    }

    // 메시지 전송
    sendMessage(message, clientIP) {
        const validation = this.validateMessage(message);
        
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // 모델에 저장
        const savedMessage = MessageModel.add(message);

        // 모든 클라이언트에게 브로드캐스트
        this.broadcast('new', message);

        console.log(
            `[${new Date().toISOString()}] MESSAGE | IP: ${this.maskIP(clientIP)} | MSG: ${message}`
        );

        return savedMessage;
    }

    // 초기 메시지 목록 가져오기
    getInitialMessages() {
        return 0;
        //return MessageModel.getAll();
    }

    // 브로드캐스트
    broadcast(type, message) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(
                    JSON.stringify({
                        type: type,
                        message: message,
                    })
                );
            }
        });
    }

    // IP 마스킹
    maskIP(ip) {
        return ip.replace(/\.\d+$/, '.***');
    }
}

module.exports = MessageController;
