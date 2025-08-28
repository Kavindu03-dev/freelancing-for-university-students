import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  // Keep participants array for flexibility
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  // Explicit fields to match existing indexes in DB
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true },
  lastMessageAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure uniqueness per client/freelancer pair, optionally scoped by orderId
conversationSchema.index(
  { client: 1, freelancer: 1, orderId: 1 },
  { unique: true, partialFilterExpression: { client: { $exists: true }, freelancer: { $exists: true } } }
);

conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;


