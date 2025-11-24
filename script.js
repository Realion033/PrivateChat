const messagesDiv = document.getElementById("messages");
const input = document.getElementById("message-input");
const nickname = document.getElementById("nickname-input");
const sendButton = document.getElementById("send-button");

// WebSocket 연결
const webSocket = new WebSocket("ws://localhost:8081");

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

// 메시지 추가 함수
function addMessage(fullMessage, isOwn) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isOwn ? "own" : "other"}`;

    // 메시지 파싱: "닉네임 : 메시지"
    const colonIndex = fullMessage.indexOf(" : ");
    if (colonIndex !== -1) {
        const nickname = fullMessage.substring(0, colonIndex);
        const message = fullMessage.substring(colonIndex + 3);
        messageDiv.innerHTML = `<span class="nickname">${nickname}  </span>${message}`;
    } else {
        messageDiv.textContent = fullMessage;
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 연결 종료
webSocket.onclose = () => {
    console.log("❌ WebSocket connection closed");
};

// 에러
webSocket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

// 메시지 보내기
sendButton.addEventListener("click", () => {
    const message = input.value.trim();
    const nicknameValue = nickname.value.trim();

    // 웹소켓 열린지 확인하고 메세지 내용 있나 확인하기
    if (message && nicknameValue && webSocket.readyState === WebSocket.OPEN) {
        // 닉넴 예외처리
        if (nicknameValue.length > 12) {
            alert("Nickname must be 12 characters or less.");
            return;
        }
        // WebSocket으로 전송 (즉시!)
        webSocket.send(`${nicknameValue} : ${message}`);
        input.value = "";
    }
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendButton.click();
    }
});
