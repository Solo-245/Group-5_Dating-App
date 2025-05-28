const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    messageId: {
         type: String,
          required: true 
        },

  chatId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Chat'
 },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
 },
  text: String,
  isRead: {
     type: Boolean, 
     default: false
     },
}, 
{ timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
