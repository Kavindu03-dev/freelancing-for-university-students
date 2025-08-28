import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// Create or get conversation between client and freelancer, optionally tied to an order
const createOrGetConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { freelancerId: freelancerIdRaw, orderId: orderIdRaw } = req.body;

    if (!freelancerIdRaw) {
      return res.status(400).json({ success: false, message: 'freelancerId is required' });
    }

    // Normalize IDs in case frontend sends populated objects
    const normalizedFreelancerId = typeof freelancerIdRaw === 'object' && freelancerIdRaw !== null
      ? (freelancerIdRaw._id || freelancerIdRaw.id || freelancerIdRaw)
      : freelancerIdRaw;
    const normalizedOrderId = typeof orderIdRaw === 'object' && orderIdRaw !== null
      ? (orderIdRaw._id || orderIdRaw.id || orderIdRaw)
      : orderIdRaw;

    // Convert to ObjectId to avoid CastErrors
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const freelancerObjectId = new mongoose.Types.ObjectId(String(normalizedFreelancerId));
    const isClient = req.user.userType === 'client';
    const clientId = isClient ? userObjectId : freelancerObjectId;
    const freelancerId = isClient ? freelancerObjectId : userObjectId;
    const participantIds = [clientId, freelancerId];

    const findQuery = {
      client: clientId,
      freelancer: freelancerId
    };
    if (normalizedOrderId) {
      try {
        findQuery.orderId = new mongoose.Types.ObjectId(String(normalizedOrderId));
      } catch (_) {
        // ignore invalid orderId filter
      }
    }

    let conversation = await Conversation.findOne(findQuery)
      .populate('participants', 'firstName lastName profileImage');

    if (!conversation) {
      conversation = new Conversation({
        participants: participantIds,
        client: clientId,
        freelancer: freelancerId,
        orderId: normalizedOrderId || undefined
      });
      await conversation.save();
      conversation = await Conversation.findById(conversation._id).populate('participants', 'firstName lastName profileImage');
    }

    return res.json({ success: true, conversation });
  } catch (error) {
    console.error('createOrGetConversation error', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create conversation' });
  }
};

// List conversations for current user
const listConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .populate('participants', 'firstName lastName profileImage');
    return res.json({ success: true, conversations });
  } catch (error) {
    console.error('listConversations error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

// Get messages in a conversation
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.map(String).includes(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return res.json({ success: true, messages });
  } catch (error) {
    console.error('getMessages error', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { text, type, metadata } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.map(String).includes(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const msg = new Message({ conversationId, senderId: userId, text: text || '', type: type || 'text', metadata });
    await msg.save();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return res.json({ success: true, message: msg });
  } catch (error) {
    console.error('sendMessage error', error);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

export { createOrGetConversation, listConversations, getMessages, sendMessage };


