function startBots() {
    const roomCode = document.getElementById('roomCode').value.trim();
    const botCount = parseInt(document.getElementById('botCount').value);
    const proxies = document.getElementById('proxies').value.split('\n').map(p => p.trim()).filter(p => p);
    const logArea = document.getElementById('log');
    
    logArea.value = ''; // Clear log

    if (!roomCode || isNaN(botCount) || botCount < 1) {
        alert('Please enter a valid room code and bot count.');
        return;
    }

    if (proxies.length === 0) {
        alert('Please enter at least one proxy.');
        return;
    }

    log(`Starting ${botCount} bots for room ${roomCode}...`);

    for (let i = 0; i < botCount; i++) {
        const proxy = proxies[i % proxies.length];
        const botName = `Bot${i + 1}`;
        log(`Creating bot ${botName} with proxy ${proxy}...`);
        createBot(roomCode, botName, proxy);
    }
}

function createBot(roomCode, botName, proxy) {
    const serverUrl = `wss://gartic.io/socket.io/?EIO=3&transport=websocket`;
    const ws = new WebSocket(serverUrl);

    ws.onopen = () => {
        log(`${botName} connected to room ${roomCode} using proxy ${proxy}`);
        ws.send(`42["cmd",{"cmd":"join","nick":"${botName}","sala":"${roomCode}"}]`);
    };

    ws.onmessage = (event) => {
        log(`Message from server for ${botName}: ${event.data}`);
    };

    ws.onerror = (error) => {
        log(`WebSocket error for ${botName} using proxy ${proxy}: ${error.message}`);
    };

    ws.onclose = () => {
        log(`${botName} disconnected.`);
    };
}

function log(message) {
    const logArea = document.getElementById('log');
    logArea.value += message + '\n';
    logArea.scrollTop = logArea.scrollHeight;
}
