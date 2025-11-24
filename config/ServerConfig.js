require('dotenv').config();

class ServerConfig {
    constructor() {
        // 서버 설정 (.env에서 가져오기)
        this.PORT = process.env.PORT || 3000;
        this.HOST = process.env.HOST || '0.0.0.0';
        
        // EC2 IP 정보 (.env에서 가져오기)
        this.PRIVATE_IP = process.env.PRIVATE_IP || '172.31.66.77';
        this.PUBLIC_IP = process.env.PUBLIC_IP || '98.84.30.95';
        
        // 환경 설정
        this.IS_PRODUCTION = process.env.NODE_ENV === 'production';
        this.TRUST_PROXY = true;
        
        // Tenor API 설정
        this.TENOR_API_KEY = process.env.TENOR_API_KEY || 'LIVD';
    }

    // 서버 정보 출력
    getServerInfo() {
        return {
            port: this.PORT,
            host: this.HOST,
            privateIP: this.PRIVATE_IP,
            publicIP: this.PUBLIC_IP,
            isProduction: this.IS_PRODUCTION
        };
    }

    // 디버깅용 로그
    printServerInfo() {
        console.log('='.repeat(50));
        console.log('📡 서버 설정 정보');
        console.log('='.repeat(50));
        console.log(`포트: ${this.PORT}`);
        console.log(`바인딩 주소: ${this.HOST}`);
        console.log(`내부 IP: ${this.PRIVATE_IP}`);
        console.log(`외부 IP: ${this.PUBLIC_IP}`);
        console.log(`프로덕션 모드: ${this.IS_PRODUCTION ? '예' : '아니오'}`);
        console.log('='.repeat(50));
    }
}

module.exports = ServerConfig;
