const express = require('express');
const Chat = require('../models/Chat');
const router = express.Router();

// Get all chat messages
router.get('/getChats', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ timestamp: 1 });
        res.json(chats);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
