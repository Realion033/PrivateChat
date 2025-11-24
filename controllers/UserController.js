const UserModel = require('../models/User');

class UserController {
    constructor(webSocketServer) {
        this.wss = webSocketServer;
    }

    // 사용자 연결
    connect(clientIP) {
        const user = UserModel.add(clientIP);
        
        console.log(
            `[${new Date().toISOString()}] CONNECT | IP: ${clientIP} | Total Users: ${UserModel.getCount()}`
        );

        return user;
    }

    // 사용자 연결 해제
    disconnect(clientIP) {
        UserModel.remove(clientIP);
        
        console.log(
            `[${new Date().toISOString()}] DISCONNECT | IP: ${clientIP} | Total Users: ${UserModel.getCount()}`
        );
    }

    // 입장 메시지 브로드캐스트
    broadcastJoin() {
        const joinMessage = `New user joined! Current Users: ${UserModel.getCount()}`;
        
        this.wss.clients.forEach((client) => {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(
                    JSON.stringify({
                        type: 'join',
                        message: joinMessage,
                    })
                );
            }
        });
    }

    // 현재 사용자 수
    getUserCount() {
        return UserModel.getCount();
    }
}

module.exports = UserController;
