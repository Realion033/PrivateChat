const messagesDiv = document.getElementById("messages");
const input = document.getElementById("message-input");
const nickname = document.getElementById("nickname-input");
const sendButton = document.getElementById("send-button");
const gifButton = document.getElementById("gif-button");
const gifModal = document.getElementById("gif-modal");
const gifSearchInput = document.getElementById("gif-search-input");
const closeGifModal = document.getElementById("close-gif-modal");
const gifResults = document.getElementById("gif-results");

let webSocket;

// 서버에서 설정 가져와서 연결
fetch('/config')
    .then(response => response.json())
    .then(config => {
        connectWebSocket(config.wsUrl);
    })
    .catch(error => {
        console.error('설정 로드 실패:', error);
        // 실패 시 현재 호스트로 시도
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        connectWebSocket(`${protocol}//${window.location.host}`);
    });

function connectWebSocket(url) {
    webSocket = new WebSocket(url);
    setupWebSocketHandlers();
}

function setupWebSocketHandlers() {
    // 연결 성공
    webSocket.onopen = () => {
        console.log("✅ WebSocket connection!");
    };

    // 서버에서 메시지 받음
    webSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "join") {
            addMessage(data.message, false);
        }
        else if (data.type === "left") {
            addMessage(data.message, false);
        }
        else if (data.type === "init") {
            // 초기 메시지 목록
            messagesDiv.innerHTML = "";
            data.messages.forEach((msg) => {
                addMessage(msg, false);
            });
        }
        else if (data.type === "new") {
            // 새 메시지 하나 추가
            addMessage(data.message, false);
        }
    };

    // 연결 종료
    webSocket.onclose = () => {
        console.log("❌ WebSocket connection closed");
    };

    // 에러
    webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

// 메시지 추가 함수 (🚨 XSS 방어 적용)
function addMessage(fullMessage, isOwn) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isOwn ? "own" : "other"}`;

    // 메시지 파싱: "닉네임 : 메시지"
    const colonIndex = fullMessage.indexOf(" : ");

    if (colonIndex !== -1) {
        // 사용자 입력에서 닉네임과 메시지 내용을 추출
        const nickname = fullMessage.substring(0, colonIndex);
        const message = fullMessage.substring(colonIndex + 3);

        // 🚨 보안 핵심: innerHTML 대신 document.createElement와 textContent를 사용합니다.
        // textContent를 사용하면 브라우저가 사용자 데이터를 순수한 '텍스트'로만 인식하여,
        // 데이터에 포함된 <script> 등의 HTML 태그가 실행되는 것을 원천적으로 차단합니다.

        // 1. 닉네임을 담을 <span> 요소 생성
        const nicknameSpan = document.createElement("span");
        nicknameSpan.className = "nickname";

        // 2. 닉네임 텍스트를 안전하게 삽입
        nicknameSpan.textContent = nickname + "  ";

        // 3. 메시지 텍스트 노드 생성 및 삽입 (가장 안전한 방법 중 하나)
        const messageTextNode = document.createTextNode(message);

        // 4. 안전하게 조립
        messageDiv.appendChild(nicknameSpan);

        // 이미지 URL인지 확인 (간단한 체크)
        if (message.startsWith('http') && (message.includes('tenor.com') || message.includes('.gif'))) {
            const img = document.createElement('img');
            img.src = message;
            img.className = 'message-image';
            img.onload = () => { messagesDiv.scrollTop = messagesDiv.scrollHeight; }; // 로드 후 스크롤
            messageDiv.appendChild(img);
        } else {
            messageDiv.appendChild(messageTextNode);
        }

    } else {
        // 콜론 구분자가 없는 경우 전체 메시지를 안전하게 textContent로 삽입
        messageDiv.textContent = fullMessage;
    }

    messagesDiv.appendChild(messageDiv);
    // 스크롤을 항상 최신 메시지로 이동
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 메시지 보내기
sendButton.addEventListener("click", () => {
    const message = input.value.trim();
    const nicknameValue = nickname.value.trim();

    // 웹소켓 열린지 확인하고 메세지 내용 있나 확인하기
    if (message && nicknameValue && webSocket.readyState === WebSocket.OPEN) {
        // 닉넴 예외처리 (클라이언트 측 검증: 보안이 아닌 UX 개선 목적)
        if (nicknameValue.length > 12) {
            alert("Nickname must be 12 characters or less.");
            return;
        }

        const fullMessage = `${nicknameValue} : ${message}`;

        // WebSocket으로 전송
        // 서버 측에서 이 메시지를 받을 때, 닉네임과 메시지에 대한
        // 추가적인 보안 검증 및 길이 제한이 반드시 이루어져야 합니다.
        webSocket.send(fullMessage);
        input.value = "";
    }
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendButton.click();
    }
});

// GIF 모달 열기/닫기
gifButton.addEventListener("click", () => {
    gifModal.classList.toggle("hidden");
    if (!gifModal.classList.contains("hidden")) {
        gifSearchInput.focus();
        searchGifs("trending"); // 열릴 때 트렌딩 GIF 보여주기
    }
});

closeGifModal.addEventListener("click", () => {
    gifModal.classList.add("hidden");
});

// GIF 검색
let searchTimeout;
gifSearchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    searchTimeout = setTimeout(() => {
        if (query) {
            searchGifs(query);
        } else {
            searchGifs("trending");
        }
    }, 500); // 0.5초 딜레이
});

async function searchGifs(query) {
    try {
        const response = await fetch(`/api/gif/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        gifResults.innerHTML = "";
        
        if (data.results) {
            data.results.forEach(gif => {
                const img = document.createElement("img");
                // tinygif가 로딩이 빠름
                img.src = gif.media_formats.tinygif.url; 
                img.className = "gif-item";
                img.onclick = () => sendGif(gif.media_formats.gif.url);
                gifResults.appendChild(img);
            });
        }
    } catch (error) {
        console.error("GIF 검색 실패:", error);
    }
}

function sendGif(url) {
    const nicknameValue = nickname.value.trim();
    if (!nicknameValue) {
        alert("Please enter a nickname first.");
        return;
    }
    
    if (webSocket.readyState === WebSocket.OPEN) {
        const fullMessage = `${nicknameValue} : ${url}`;
        
        // 내 화면에 표시
        addMessage(fullMessage, true);
        
        // 전송
        webSocket.send(fullMessage);
        
        // 모달 닫기
        gifModal.classList.add("hidden");
    }
}