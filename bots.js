function startBots() {
    const roomCode = document.getElementById('roomCode').value;
    const botCount = parseInt(document.getElementById('botCount').value);
    
    if (!roomCode || isNaN(botCount) || botCount < 1) {
        alert('Please enter a valid room code and bot count.');
        return;
    }

    for (let i = 0; i < botCount; i++) {
        createBot(roomCode, `Bot${i + 1}`);
    }
}

function createBot(roomCode, botName) {
    const serverUrl = `wss://gartic.io/socket.io/?EIO=3&transport=websocket`;

    const ws = new WebSocket(serverUrl);

    ws.onopen = () => {
        console.log(`${botName} connected to room ${roomCode}`);
        ws.send(`42["cmd",{"cmd":"join","nick":"${botName}","sala":"${roomCode}"}]`);
    };

    ws.onmessage = (event) => {
        console.log(`Message from server: ${event.data}`);
    };

    ws.onerror = (error) => {
        console.error(`WebSocket error for ${botName}:`, error);
    };

    ws.onclose = () => {
        console.log(`${botName} disconnected.`);
    };
}
