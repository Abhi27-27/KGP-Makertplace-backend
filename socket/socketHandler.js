import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    socket.join(`user:${userId}`);

    socket.on('send_message', async ({ conversationId, text }) => {
      try {
        if (!text?.trim()) return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant = conversation.participants.some(
          (p) => p.toString() === userId
        );
        if (!isParticipant) return;

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          text: text.trim(),
        });

        conversation.lastMessage = text.trim();
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populated = await Message.findById(message._id).populate('sender', 'name email');

        const recipientId = conversation.participants.find(
          (p) => p.toString() !== userId
        )?.toString();

        io.to(`user:${userId}`).emit('new_message', {
          message: populated,
          conversationId,
        });

        if (recipientId) {
          io.to(`user:${recipientId}`).emit('new_message', {
            message: populated,
            conversationId,
          });
          io.to(`user:${recipientId}`).emit('chat_notification', {
            message: populated,
            conversationId,
            senderName: socket.user.name,
          });
        }
      } catch (err) {
        console.error('Socket send_message error:', err);
      }
    });

    socket.on('mark_read', async ({ conversationId }) => {
      try {
        await Message.updateMany(
          { conversation: conversationId, sender: { $ne: userId }, read: false },
          { read: true }
        );
        io.to(`user:${userId}`).emit('messages_read', { conversationId });
      } catch (err) {
        console.error('Socket mark_read error:', err);
      }
    });

    socket.on('disconnect', () => {});
  });
};
