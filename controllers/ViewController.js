const path = require('path');

class ViewController {
    // 메인 페이지 렌더링
    renderIndex(req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    }

    // 에러 페이지
    renderError(req, res, statusCode = 500, message = 'Internal Server Error') {
        res.status(statusCode).json({
            error: message,
            timestamp: new Date().toISOString()
        });
    }

    // 상태 페이지 (헬스체크)
    renderStatus(req, res) {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
}

module.exports = new ViewController();
