const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// MongoDB connection
mongoose.connect('mongodb+srv://ssavsm:oGvOrtP8R5Z3v9ZM@cluster0.3sjg1ti.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create an Express app
const app = express();
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chats', chatRoutes);

// WebSocket connection
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Listen for messages from the client
    ws.on('message', async (message) => {
        console.log(message,'msg.....')
        const { user, chat } = JSON.parse(message);

        // Save the message to the database
        const newChat = new (require('./models/Chat'))({
            user,
            message: chat,
        });
        await newChat.save();

        // Broadcast the message to all clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ user, chat }));
            }
        });
    });

    // Handle disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
