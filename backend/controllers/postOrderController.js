import PostOrder from '../models/PostOrder.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Stripe from "stripe";

// Global variables
const currency = 'usd';
const platformFee = 0.10; // 10% platform fee

// Helper function to get Stripe instance
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Place post order with Stripe payment
const placePostOrderStripe = async (req, res) => {
    try {
        const { 
            postId, 
            requirements, 
            deadline 
        } = req.body;
        
        const freelancerId = req.user.id; // From auth middleware

        // Validate required fields
        if (!postId || !requirements || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Fetch post details
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if post is active and approved
        if (!post.isActive || post.approvalStatus !== 'Approved') {
            return res.status(400).json({
                success: false,
                message: "Post is not available for orders"
            });
        }

        // Check if user is not the client (can't order their own post)
        if (post.clientId.toString() === freelancerId) {
            return res.status(400).json({
                success: false,
                message: "You cannot order your own post"
            });
        }

        // Calculate total amount with platform fee
        const basePrice = post.budget;
        const platformFeeAmount = basePrice * platformFee;
        const totalAmount = basePrice + platformFeeAmount;

        // Create post order data
        const orderData = {
            clientId: post.clientId,
            freelancerId,
            postId,
            postDetails: {
                title: post.title,
                type: post.type,
                category: post.category,
                budget: post.budget,
                description: post.description,
                requiredSkills: post.requiredSkills,
                degreeField: post.degreeField,
                location: post.location
            },
            totalAmount,
            requirements,
            deadline: new Date(deadline),
            paymentMethod: "Stripe",
            paymentStatus: "Pending"
        };

        // Create the post order
        const newPostOrder = new PostOrder(orderData);
        await newPostOrder.save();

        // Create Stripe checkout session
        const line_items = [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: `${post.title} - ${post.type}`,
                        description: post.description
                    },
                    unit_amount: Math.round(totalAmount * 100) // Convert to cents
                },
                quantity: 1
            }
        ];

        // Add platform fee as separate line item
        if (platformFeeAmount > 0) {
            line_items.push({
                price_data: {
                    currency: currency,
                    product_data: {
                        name: 'Platform Fee',
                        description: 'Post platform fee'
                    },
                    unit_amount: Math.round(platformFeeAmount * 100)
                },
                quantity: 1
            });
        }

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            success_url: `${req.headers.origin}/post-orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/post-orders/cancel?session_id={CHECKOUT_SESSION_ID}`,
            line_items,
            mode: 'payment',
            metadata: {
                postOrderId: newPostOrder._id.toString(),
                postId: postId
            },
            customer_email: req.user.email
        });

        // Update post order with Stripe session ID
        newPostOrder.stripeSessionId = session.id;
        await newPostOrder.save();

        res.json({ 
            success: true, 
            session_url: session.url,
            postOrderId: newPostOrder._id 
        });

    } catch (error) {
        console.error("Place post order error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify Stripe payment for post order
const verifyPostOrderStripePayment = async (req, res) => {
    try {
        const { session_id } = req.body;
        
        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required"
            });
        }

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === "paid") {
            const postOrderId = session.metadata.postOrderId;
            const postOrder = await PostOrder.findById(postOrderId);
            
            if (!postOrder) {
                return res.status(404).json({
                    success: false,
                    message: "Post order not found"
                });
            }

            // Update post order status
            postOrder.paymentStatus = "Paid";
            postOrder.status = "Payment Confirmed";
            postOrder.stripePaymentIntentId = session.payment_intent;
            await postOrder.save();

            res.json({ 
                success: true, 
                message: "Payment verified successfully",
                postOrder: postOrder
            });
        } else {
            // Payment failed
            const postOrderId = session.metadata.postOrderId;
            if (postOrderId) {
                const postOrder = await PostOrder.findById(postOrderId);
                if (postOrder) {
                    postOrder.paymentStatus = "Failed";
                    await postOrder.save();
                }
            }
            
            res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }
    } catch (error) {
        console.error("Verify post order stripe error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all post orders for a user
const getAllPostOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.userType;

        let query = {};
        
        // Filter based on user type
        if (userType === 'client') {
            query.clientId = userId;
        } else if (userType === 'student' || userType === 'freelancer') {
            query.freelancerId = userId;
        } else if (userType === 'admin') {
            // Admin can see all orders
        } else {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const postOrders = await PostOrder.find(query)
            .populate('clientId', 'firstName lastName email')
            .populate('freelancerId', 'firstName lastName email')
            .populate('postId', 'title type category')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            postOrders
        });
    } catch (error) {
        console.error("Get all post orders error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get post order details by ID
const getPostOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const userType = req.user.userType;

        const postOrder = await PostOrder.findById(orderId)
            .populate('clientId', 'firstName lastName email organization')
            .populate('freelancerId', 'firstName lastName email university degreeField')
            .populate('postId', 'title type category description requiredSkills');

        if (!postOrder) {
            return res.status(404).json({
                success: false,
                message: 'Post order not found'
            });
        }

        // Check if user has access to this order
        if (userType !== 'admin' && 
            postOrder.clientId._id.toString() !== userId && 
            postOrder.freelancerId._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            postOrder
        });
    } catch (error) {
        console.error("Get post order by ID error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update post order status
const updatePostOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userType = req.user.userType;

        const postOrder = await PostOrder.findById(orderId);
        
        if (!postOrder) {
            return res.status(404).json({
                success: false,
                message: 'Post order not found'
            });
        }

        // Check if user has permission to update this order
        if (userType !== 'admin' && 
            postOrder.clientId.toString() !== userId && 
            postOrder.freelancerId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Validate status transition
        const validTransitions = {
            'Pending': ['Payment Confirmed'],
            'Payment Confirmed': ['In Progress'],
            'In Progress': ['Review', 'Completed'],
            'Review': ['Completed', 'Revision'],
            'Revision': ['In Progress', 'Completed'],
            'Completed': [],
            'Cancelled': []
        };

        if (!validTransitions[postOrder.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status transition from ${postOrder.status} to ${status}`
            });
        }

        postOrder.status = status;
        await postOrder.save();

        res.json({
            success: true,
            message: 'Post order status updated successfully',
            postOrder
        });
    } catch (error) {
        console.error("Update post order status error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel post order
const cancelPostOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const postOrder = await PostOrder.findById(orderId);
        
        if (!postOrder) {
            return res.status(404).json({
                success: false,
                message: 'Post order not found'
            });
        }

        // Check if user has permission to cancel this order
        if (postOrder.clientId.toString() !== userId && req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if order can be cancelled
        if (postOrder.status === 'Completed' || postOrder.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Post order cannot be cancelled in its current status'
            });
        }

        postOrder.status = 'Cancelled';
        await postOrder.save();

        // If payment was made, initiate refund
        if (postOrder.paymentStatus === 'Paid' && postOrder.stripePaymentIntentId) {
            try {
                const stripe = getStripe();
                await stripe.refunds.create({
                    payment_intent: postOrder.stripePaymentIntentId,
                    reason: 'requested_by_customer'
                });
                postOrder.paymentStatus = 'Refunded';
                await postOrder.save();
            } catch (refundError) {
                console.error('Refund error:', refundError);
            }
        }

        res.json({
            success: true,
            message: 'Post order cancelled successfully',
            postOrder: postOrder
        });
    } catch (error) {
        console.error("Cancel post order error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {
    placePostOrderStripe,
    verifyPostOrderStripePayment,
    getAllPostOrders,
    getPostOrderById,
    updatePostOrderStatus,
    cancelPostOrder
};
