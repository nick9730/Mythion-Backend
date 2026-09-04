import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true }); 

export default mongoose.model('ChatMessage', ChatMessageSchema);