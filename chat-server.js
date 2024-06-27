const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const userRoutes = require('./routes/user');

const app = express();
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use(express.static('public'));

const server = app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'message') {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            username: data.username,
            message: data.message,
            timestamp: new Date().toISOString()
          }));
        }
      });
    }
  });
});
