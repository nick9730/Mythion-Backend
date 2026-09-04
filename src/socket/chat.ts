import { Server, Socket } from 'socket.io';
import ChatMessage from '../models/ChatMessage';

export function registerChatHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('chat_message', async (data: { username: string; message: string }) => {
  
      if (!data?.username || !data?.message || data.message.trim().length === 0) {
        return;
      }

      const trimmedMessage = data.message.trim().slice(0, 300); 

      try {
        const saved = await ChatMessage.create({
          username: data.username,
          message: trimmedMessage,
        });

        io.emit('chat_message', {
          username: saved.username,
          message: saved.message,
          timestamp: saved.get('createdAt'),
        });
      } catch (err) {
        console.error('Chat save error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(' Client disconnected:', socket.id);
    });
  });
}