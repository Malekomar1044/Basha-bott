function startBots() {
    const roomCode = document.getElementById('roomCode').value.trim();
    const botCount = parseInt(document.getElementById('botCount').value);
    const proxies = document.getElementById('proxies').value.split('\n').map(p => p.trim()).filter(p => p);

    if (!roomCode || isNaN(botCount) || botCount < 1) {
        alert('Please enter a valid room code and bot count.');
        return;
    }

    if (proxies.length === 0) {
        alert('Please enter at least one proxy.');
        return;
    }

    for (let i = 0; i < botCount; i++) {
        const proxy = proxies[i % proxies.length];  // استخدام البروكسيات بشكل دائري
        createBot(roomCode, `Bot${i + 1}`, proxy);
    }
}

function createBot(roomCode, botName, proxy) {
    const serverUrl = `wss://gartic.io/socket.io/?EIO=3&transport=websocket`;

    // إعداد البروكسي للاتصال
    const ws = new WebSocket(serverUrl, [], {
        headers: {
            'X-Forwarded-For': proxy
        }
    });

    ws.onopen = () => {
        console.log(`${botName} connected to room ${roomCode} using proxy ${proxy}`);
        ws.send(`42["cmd",{"cmd":"join","nick":"${botName}","sala":"${roomCode}"}]`);
    };

    ws.onmessage = (event) => {
        console.log(`Message from server for ${botName}: ${event.data}`);
    };

    ws.onerror = (error) => {
        console.error(`WebSocket error for ${botName} using proxy ${proxy}:`, error);
    };

    ws.onclose = () => {
        console.log(`${botName} disconnected.`);
    };
}
