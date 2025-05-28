const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true,
    },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' }],
  lastMessage: String,
},
 {
     timestamps: true 
    
    });

module.exports = mongoose.model('Chat', chatSchema);
