const mongoose = require('mongoose');

// Schema for the chat messages
const chatSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
