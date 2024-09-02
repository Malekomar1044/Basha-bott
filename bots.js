async function startBots() {
    const roomCode = document.getElementById('roomCode').value.trim();
    const botCount = parseInt(document.getElementById('botCount').value);
    const logArea = document.getElementById('log');
    
    logArea.value = ''; // مسح السجل

    if (!roomCode || isNaN(botCount) || botCount < 1) {
        alert('Please enter a valid room code and bot count.');
        return;
    }

    log(`Starting ${botCount} bots for room ${roomCode}...`);

    for (let i = 0; i < botCount; i++) {
        const botName = `Bot${i + 1}`;
        const proxy = generateRandomProxy(); // توليد بروكسي وهمي
        log(`Creating bot ${botName} with proxy ${proxy}...`);
        await createBot(roomCode, botName, proxy);
    }
}

function generateRandomProxy() {
    // توليد IP عشوائي
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function log(message) {
    const logArea = document.getElementById('log');
    logArea.value += message + '\n';
}

function createBot(roomCode, botName, proxy) {
    return new Promise((resolve) => {
        const serverUrl = `wss://gartic.io/socket.io/?EIO=3&transport=websocket`;
        const ws = new WebSocket(serverUrl, [], {
            headers: {
                'X-Forwarded-For': proxy
            }
        });

        ws.onopen = () => {
            log(`${botName} connected to room ${roomCode} using proxy ${proxy}`);
            ws.send(`42["cmd",{"cmd":"join","nick":"${botName}","sala":"${roomCode}"}]`);
        };

        ws.onmessage = (event) => {
            log(`Message from server for ${botName}: ${event.data}`);
        };

        ws.onerror = (error) => {
            log(`WebSocket error for ${botName} using proxy ${proxy}: ${error.message}`);
            resolve();
        };

        ws.onclose = () => {
            log(`${botName} disconnected.`);
            resolve();
        };
    });
}
