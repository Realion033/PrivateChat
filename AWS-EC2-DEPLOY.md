# AWS EC2 배포 가이드

## 1️⃣ EC2 인스턴스 생성

1. AWS 콘솔 → EC2 → "인스턴스 시작"
2. **AMI 선택**: Ubuntu Server 22.04 LTS
3. **인스턴스 유형**: t2.micro (프리티어)
4. **키 페어**: 새로 생성하고 다운로드 (.pem 파일)
5. **보안 그룹 설정**:
   - SSH (22) - 내 IP
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom TCP (8080) - 0.0.0.0/0

## 2️⃣ EC2 접속

```bash
# Windows (PowerShell)
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# 또는 PuTTY 사용
```

## 3️⃣ 서버 환경 설정

```bash
# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git 설치
sudo apt-get install -y git

# PM2 설치 (프로세스 관리자)
sudo npm install -y pm2 -g
```

## 4️⃣ 프로젝트 배포

```bash
# 1. 프로젝트 업로드 (방법 1: Git)
git clone https://github.com/your-repo.git
cd your-repo

# 또는 (방법 2: 직접 업로드)
# FileZilla 또는 SCP로 파일 전송

# 2. 의존성 설치
npm install

# 3. PM2로 서버 실행
pm2 start main-server-mvc.js --name chat-server

# 4. PM2 자동 시작 설정
pm2 startup
pm2 save
```

## 5️⃣ 서버 상태 확인

```bash
# 서버 로그 보기
pm2 logs chat-server

# 서버 상태 확인
pm2 status

# 서버 재시작
pm2 restart chat-server

# 서버 중지
pm2 stop chat-server
```

## 6️⃣ 방화벽 설정 (중요!)

```bash
# UFW 방화벽 설정
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8080
sudo ufw enable
```

## 7️⃣ Nginx 리버스 프록시 설정 (선택사항)

```bash
# Nginx 설치
sudo apt-get install -y nginx

# Nginx 설정
sudo nano /etc/nginx/sites-available/default
```

Nginx 설정 파일 내용:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Nginx 재시작
sudo systemctl restart nginx
```

## 8️⃣ 접속 확인

```
http://your-ec2-public-ip:8080
```

## ⚠️ 중요 사항

1. **보안 그룹**: EC2 보안 그룹에서 8080 포트 열기
2. **실제 IP 수집**: 코드에서 프록시 헤더로 IP 가져오기 ✅ (이미 적용됨)
3. **환경변수**: `PORT=8080 pm2 start main-server-mvc.js`
4. **HTTPS**: Let's Encrypt로 SSL 인증서 설정 권장

## 🚀 빠른 배포 명령어

```bash
# 한번에 실행
cd /home/ubuntu && \
git clone your-repo && \
cd your-repo && \
npm install && \
pm2 start main-server-mvc.js --name chat-server && \
pm2 save
```
