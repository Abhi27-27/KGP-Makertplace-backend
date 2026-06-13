import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Product from '../models/Product.js';

const buildParticipantKey = (userIdA, userIdB, productId) => {
  const ids = [userIdA.toString(), userIdB.toString()].sort();
  return `${ids[0]}_${ids[1]}_${productId}`;
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email')
      .populate('product', 'title price category')
      .sort({ lastMessageAt: -1 });

    const withUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: req.user._id },
          read: false,
        });
        return { ...conv.toObject(), unreadCount };
      })
    );

    res.json(withUnread);
  } catch {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

export const getOrCreateConversation = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const sellerId = product.seller._id.toString();
    const buyerId = req.user._id.toString();

    if (sellerId === buyerId) {
      return res.status(400).json({ message: 'You cannot chat with yourself' });
    }

    const participantKey = buildParticipantKey(buyerId, sellerId, productId);

    let conversation = await Conversation.findOne({ participantKey })
      .populate('participants', 'name email')
      .populate('product', 'title price category');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [buyerId, sellerId],
        product: productId,
        participantKey,
      });
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email')
        .populate('product', 'title price category');
    }

    res.json(conversation);
  } catch {
    res.status(500).json({ message: 'Error starting conversation' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    res.json(messages);
  } catch {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id }).select('_id');
    const conversationIds = conversations.map((c) => c._id);

    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: req.user._id },
      read: false,
    });

    res.json({ unreadCount });
  } catch {
    res.status(500).json({ message: 'Error fetching unread count' });
  }
};

export { buildParticipantKey };
