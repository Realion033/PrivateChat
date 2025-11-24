const axios = require('axios');
const ServerConfig = require('../config/ServerConfig');
const config = new ServerConfig();

class GifController {
    async search(req, res) {
        try {
            const query = req.query.q;
            const limit = req.query.limit || 10;
            
            // Tenor API v2 호출
            // API Key가 없으면 기본 키(LIVD) 사용 (테스트용)
            const apiKey = config.TENOR_API_KEY;
            const clientKey = "PrivateChat_App"; // 식별자
            
            const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${apiKey}&client_key=${clientKey}&limit=${limit}`;
            
            const response = await axios.get(url);
            
            res.json(response.data);
        } catch (error) {
            console.error('Tenor API Error:', error.message);
            res.status(500).json({ error: 'GIF 검색 중 오류가 발생했습니다.' });
        }
    }
}

module.exports = new GifController();
