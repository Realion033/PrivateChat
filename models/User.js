// User Model
class User {
    constructor() {
        this.users = new Map(); // clientIP -> user info
    }

    add(clientIP, nickname = null) {
        const user = {
            ip: clientIP,
            nickname: nickname,
            connectedAt: new Date().toISOString()
        };
        
        this.users.set(clientIP, user);
        return user;
    }

    remove(clientIP) {
        return this.users.delete(clientIP);
    }

    get(clientIP) {
        return this.users.get(clientIP);
    }

    getCount() {
        return this.users.size;
    }

    exists(clientIP) {
        return this.users.has(clientIP);
    }
}

module.exports = new User();
