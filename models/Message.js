// Message Model
class Message {
    constructor() {
        this.messages = [];
        this.maxMessages = 100;
    }

    add(message) {
        if (!message || typeof message !== 'string') {
            throw new Error('Invalid message');
        }
        
        this.messages.push({
            content: message,
            timestamp: new Date().toISOString()
        });

        // 최대 개수 제한
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
        }

        return this.messages[this.messages.length - 1];
    }

    getAll() {
        return this.messages.map(m => m.content);
    }

    clear() {
        this.messages = [];
    }

    getCount() {
        return this.messages.length;
    }
}

module.exports = new Message();
