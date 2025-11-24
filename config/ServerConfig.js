class ServerConfig {
    constructor() {
        // 서버 설정
        this.PORT = process.env.PORT || 3000;
        this.HOST = '0.0.0.0'; // 모든 인터페이스에서 접속 허용
        
        // EC2 IP 정보
        this.PRIVATE_IP = '172.31.66.77';  // EC2 내부 IP
        this.PUBLIC_IP = '98.84.30.95';    // EC2 외부 IP (사용자 접속용)
        
        // 환경 설정
        this.IS_PRODUCTION = process.env.NODE_ENV === 'production';
        this.TRUST_PROXY = true; // 프록시 뒤에서 실제 IP 가져오기
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
