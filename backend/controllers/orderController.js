import Order from '../models/Order.js';
import Service from '../models/Service.js';
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

// Place order with Stripe payment
const placeOrderStripe = async (req, res) => {
    try {
        const { 
            serviceId, 
            selectedPackage, 
            requirements, 
            deadline 
        } = req.body;
        
        const clientId = req.user.id; // From auth middleware

        // Validate required fields
        if (!serviceId || !selectedPackage || !requirements || !deadline) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Fetch service details
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }
        
        // Debug logging
        console.log('Service found:', {
            id: service._id,
            title: service.title,
            isActive: service.isActive,
            status: service.status,
            freelancerId: service.freelancerId
        });
        
        console.log('Service object keys:', Object.keys(service));
        console.log('Service isActive type:', typeof service.isActive);
        console.log('Service isActive value:', service.isActive);
        console.log('Service status type:', typeof service.status);
        console.log('Service status value:', service.status);

        // Check if service is active and available for orders
        if (service.isActive === false) {
            return res.status(400).json({
                success: false,
                message: "Service is not available for orders"
            });
        }

        // Check if the user is trying to order their own service
        if (service.freelancerId.toString() === clientId) {
            return res.status(400).json({
                success: false,
                message: "You cannot order your own service"
            });
        }
        
        // Ensure service has required fields
        if (!service.packages || Object.keys(service.packages).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Service packages are not configured"
            });
        }
        
        // Optional: Check if service is approved (can be commented out if you want all active services to be orderable)
        // if (service.status !== 'approved') {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Service is pending approval and not available for orders yet"
        //     });
        // }

        // Get package details
        const packageDetails = service.packages[selectedPackage];
        if (!packageDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid package selected"
            });
        }

        // Calculate total amount with platform fee
        const basePrice = packageDetails.price;
        const platformFeeAmount = basePrice * platformFee;
        const totalAmount = basePrice + platformFeeAmount;

        // Create order data
        const orderData = {
            clientId,
            freelancerId: service.freelancerId,
            serviceId,
            selectedPackage,
            packageDetails: {
                name: packageDetails.name,
                price: packageDetails.price,
                description: packageDetails.description,
                features: packageDetails.features,
                deliveryTime: packageDetails.deliveryTime,
                revisions: packageDetails.revisions
            },
            totalAmount,
            requirements,
            deadline: new Date(deadline),
            paymentMethod: "Stripe",
            paymentStatus: "Pending"
        };

        // Create the order
        const newOrder = new Order(orderData);
        await newOrder.save();

        // Create Stripe checkout session
        const line_items = [
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: `${service.title} - ${packageDetails.name} Package`,
                        description: packageDetails.description
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
                        description: 'Service platform fee'
                    },
                    unit_amount: Math.round(platformFeeAmount * 100)
                },
                quantity: 1
            });
        }

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            success_url: `${req.headers.origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/orders/cancel?session_id={CHECKOUT_SESSION_ID}`,
            line_items,
            mode: 'payment',
            metadata: {
                orderId: newOrder._id.toString(),
                serviceId: serviceId,
                selectedPackage: selectedPackage
            },
            customer_email: req.user.email
        });

        // Update order with Stripe session ID
        newOrder.stripeSessionId = session.id;
        await newOrder.save();

        res.json({ 
            success: true, 
            session_url: session.url,
            orderId: newOrder._id 
        });

    } catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify Stripe payment
const verifyStripePayment = async (req, res) => {
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
            const orderId = session.metadata.orderId;
            const order = await Order.findById(orderId);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });
            }

            // Update order status
            order.paymentStatus = "Paid";
            order.status = "Payment Confirmed";
            order.stripePaymentIntentId = session.payment_intent;
            await order.save();

            res.json({ 
                success: true, 
                message: "Payment verified successfully",
                order: order
            });
        } else {
            // Payment failed
            const orderId = session.metadata.orderId;
            if (orderId) {
                const order = await Order.findById(orderId);
                if (order) {
                    order.paymentStatus = "Failed";
                    await order.save();
                }
            }
            
            res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }
    } catch (error) {
        console.error("Verify stripe error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders (for admin/freelancer)
const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.userType;

        let query = {};
        
        // Filter orders based on user type
        if (userType === 'freelancer') {
            query.freelancerId = userId;
        } else if (userType === 'client') {
            query.clientId = userId;
        }
        // Admin can see all orders

        const orders = await Order.find(query)
            .populate('clientId', 'firstName lastName email profileImage')
            .populate('freelancerId', 'firstName lastName email profileImage')
            .populate('serviceId', 'title category')
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: true,
                orders: [],
                message: 'No orders found'
            });
        }

        res.status(200).json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Get order details
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(orderId)
            .populate('clientId', 'firstName lastName email profileImage phoneNumber')
            .populate('freelancerId', 'firstName lastName email profileImage phoneNumber')
            .populate('serviceId', 'title description category images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user has access to this order
        if (order.clientId._id.toString() !== userId && 
            order.freelancerId._id.toString() !== userId &&
            req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error("Get order details error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, statusType } = req.body; // statusType can be 'client', 'freelancer', or 'overall'
        const userId = req.user.id;

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user has permission to update this order
        if (req.user.userType === 'client') {
            if (statusType !== 'client' || status !== 'Delivered') {
                return res.status(403).json({
                    success: false,
                    message: 'Clients can only mark orders as delivered'
                });
            }
            // Check if the client owns this order
            if (order.clientId.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
        } else if (req.user.userType === 'freelancer') {
            if (statusType !== 'freelancer') {
                return res.status(403).json({
                    success: false,
                    message: 'Freelancers can only update their own status'
                });
            }
            // Check if the freelancer owns this order
            if (order.freelancerId.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
        } else if (req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Update the appropriate status
        if (statusType === 'client') {
            order.clientStatus = status;
        } else if (statusType === 'freelancer') {
            order.freelancerStatus = status;
        } else {
            // Overall status update (for admins)
            order.status = status;
        }

        // Update overall status based on client and freelancer statuses
        if (order.clientStatus === 'Delivered' && order.freelancerStatus === 'Completed') {
            order.status = 'Completed';
        } else if (order.freelancerStatus === 'In Progress') {
            order.status = 'In Progress';
        } else if (order.clientStatus === 'Pending' && order.freelancerStatus === 'Pending') {
            order.status = 'Pending';
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order: order
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user has permission to cancel this order
        if (order.clientId.toString() !== userId && req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if order can be cancelled
        if (order.status === 'Completed' || order.status === 'Cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled in its current status'
            });
        }

        order.status = 'Cancelled';
        await order.save();

        // If payment was made, initiate refund
        if (order.paymentStatus === 'Paid' && order.stripePaymentIntentId) {
            try {
                const stripe = getStripe();
                await stripe.refunds.create({
                    payment_intent: order.stripePaymentIntentId,
                    reason: 'requested_by_customer'
                });
                order.paymentStatus = 'Refunded';
                await order.save();
            } catch (refundError) {
                console.error('Refund error:', refundError);
            }
        }

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            order: order
        });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mark order as paid by admin (for completed orders)
const markOrderAsPaidByAdmin = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Check if user is admin
        if (req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can mark orders as paid'
            });
        }

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order is completed (both client and freelancer must be complete)
        if (order.clientStatus !== 'Delivered' || order.freelancerStatus !== 'Completed') {
            return res.status(400).json({
                success: false,
                message: 'Order must be delivered by client and completed by freelancer before payment'
            });
        }

        // Check if order is already paid
        if (order.paymentStatus === 'Paid') {
            return res.status(400).json({
                success: false,
                message: 'Order is already marked as paid'
            });
        }

        // Mark order as paid
        order.paymentStatus = 'Paid';
        await order.save();

        res.json({
            success: true,
            message: 'Order marked as paid successfully',
            order: order
        });
    } catch (error) {
        console.error("Mark order as paid error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send money to freelancer's wallet (admin only)
const sendMoneyToFreelancer = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { freelancerAmount, websiteFee, totalAmount } = req.body;
        
        // Check if user is admin
        if (req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can send money to freelancers'
            });
        }

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order is completed (both client and freelancer must be complete)
        if (order.clientStatus !== 'Delivered' || order.freelancerStatus !== 'Completed') {
            return res.status(400).json({
                success: false,
                message: 'Order must be delivered by client and completed by freelancer before payment'
            });
        }

        // Validate amounts
        if (freelancerAmount == null || websiteFee == null || totalAmount == null) {
            return res.status(400).json({
                success: false,
                message: 'Missing amount information'
            });
        }

        // Verify the amounts add up correctly
        if (Math.abs((freelancerAmount + websiteFee) - totalAmount) > 0.01) {
            return res.status(400).json({
                success: false,
                message: 'Amount validation failed'
            });
        }

        // Prevent double payout (use payout timestamp, not buyer payment status)
        if (order?.paymentDetails?.paidAt) {
            return res.status(400).json({
                success: false,
                message: 'Order already paid out to freelancer'
            });
        }

        // Credit freelancer wallet
        const freelancer = await User.findById(order.freelancerId);
        if (!freelancer) {
            return res.status(404).json({
                success: false,
                message: 'Freelancer not found'
            });
        }

        const currentBalance = Number(freelancer.walletBalance || 0);
        const creditedAmount = Number(freelancerAmount);
        freelancer.walletBalance = currentBalance + creditedAmount;
        await freelancer.save();

        // Mark order as paid and completed
        order.paymentStatus = 'Paid';
        order.status = 'Completed';
        order.paymentDetails = {
            freelancerAmount,
            websiteFee,
            totalAmount,
            paidAt: new Date(),
            transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        await order.save();

        console.log(`Money sent to freelancer:`, {
            orderId,
            freelancerId: order.freelancerId,
            freelancerAmount,
            websiteFee,
            totalAmount,
            timestamp: new Date()
        });

        res.json({
            success: true,
            message: 'Money sent to freelancer successfully',
            order: order,
            paymentDetails: {
                freelancerAmount,
                websiteFee,
                totalAmount
            }
        });
    } catch (error) {
        console.error("Send money to freelancer error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add review for an order (client -> service)
// POST /api/orders/:orderId/review { rating, comment }
const addOrderReview = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        if (req.user.userType !== 'client') {
            return res.status(403).json({ success: false, message: 'Only clients can add reviews' });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        if (!comment || comment.trim().length < 5) {
            return res.status(400).json({ success: false, message: 'Comment must be at least 5 characters' });
        }
        if (comment.length > 500) {
            return res.status(400).json({ success: false, message: 'Comment must be 500 characters or less' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.clientId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'You are not the owner of this order' });
        }

        // Allow review only after client marked Delivered OR overall order completed
        if (order.clientStatus !== 'Delivered' && order.status !== 'Completed') {
            return res.status(400).json({ success: false, message: 'You can review only after marking as delivered or order completed' });
        }

        if (order.reviewSubmitted) {
            return res.status(400).json({ success: false, message: 'Review already submitted for this order' });
        }

        const service = await Service.findById(order.serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Related service not found' });
        }

        // Only prevent duplicate review for the same order
        const existingOrderReview = service.reviews.find(r => r.order && r.order.toString() === orderId);
        if (existingOrderReview) {
            return res.status(400).json({ success: false, message: 'This order already has a review' });
        }

        service.reviews.push({ client: userId, order: orderId, rating, comment });
        service.calculateAverageRating();
        await service.save();

        order.reviewSubmitted = true;
        order.review = { rating, comment, createdAt: new Date() };
        await order.save();

        await service.populate('reviews.client', 'firstName lastName profileImage');

        res.json({ success: true, message: 'Review submitted', service, order });
    } catch (error) {
        console.error('Add order review error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export {
    placeOrderStripe,
    verifyStripePayment,
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
    markOrderAsPaidByAdmin,
    sendMoneyToFreelancer
};

export { addOrderReview };

// ==============================
// PDF REPORT GENERATION (Client)
// ==============================
import PDFDocument from 'pdfkit';

// Generate PDF report of authenticated client's orders
// GET /api/orders/report/pdf
// Query params (optional): status=Completed|Pending|In Progress, from=YYYY-MM-DD, to=YYYY-MM-DD
const generateClientOrdersReport = async (req, res) => {
    try {
        if (req.user.userType !== 'client') {
            return res.status(403).json({ success: false, message: 'Only clients can download their orders report' });
        }

        const clientId = req.user.id;
        const { status, from, to } = req.query;

        const filter = { clientId };
        if (status) {
            filter.status = status; // overall status
        }
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) {
                const toDate = new Date(to);
                // include the entire day
                toDate.setHours(23,59,59,999);
                filter.createdAt.$lte = toDate;
            }
        }

        const orders = await Order.find(filter)
            .populate('freelancerId', 'firstName lastName email')
            .populate('serviceId', 'title category')
            .sort({ createdAt: -1 });

        // Create pdf doc
        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        const filename = `orders-report-${new Date().toISOString().slice(0,10)}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Pipe document
        doc.pipe(res);

        // Title
        doc.fontSize(20).text('Client Orders Report', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#555').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(1);
        doc.fillColor('black');

        // Filter summary
        doc.fontSize(12).text('Filters Applied:', { underline: true });
        doc.fontSize(10).list([
            `Status: ${status || 'All'}`,
            `From: ${from || 'N/A'}`,
            `To: ${to || 'N/A'}`,
            `Total Orders: ${orders.length}`
        ]);
        doc.moveDown(1);

        if (!orders.length) {
            doc.fontSize(14).text('No orders found for the selected filters.', { align: 'center' });
            doc.end();
            return; // response already being streamed
        }

        // Table header like section
        const drawDivider = () => {
            doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#cccccc').stroke();
        };

        orders.forEach((order, idx) => {
            if (idx > 0) {
                doc.moveDown(0.5);
                drawDivider();
                doc.moveDown(0.5);
            }

            const freelancerName = order.freelancerId ? `${order.freelancerId.firstName} ${order.freelancerId.lastName}` : 'N/A';
            doc.fontSize(12).fillColor('#222').text(`${idx + 1}. ${order.serviceId?.title || 'Service Order'} (${order.selectedPackage} package)`, { continued: false });
            doc.moveDown(0.2);
            doc.fontSize(9).fillColor('#555').text(`Order ID: ${order._id}`);
            doc.fontSize(9).text(`Created: ${order.createdAt.toLocaleDateString()}  |  Updated: ${order.updatedAt.toLocaleDateString()}`);
            doc.fontSize(9).text(`Freelancer: ${freelancerName}`);
            doc.fontSize(9).text(`Status (Overall): ${order.status} | Client: ${order.clientStatus || '-'} | Freelancer: ${order.freelancerStatus || '-'}`);
            doc.fontSize(9).text(`Payment: ${order.paymentStatus} (${order.paymentMethod || 'N/A'})`);
            doc.fontSize(9).text(`Amount: $${order.totalAmount}`);
            if (order.deadline) {
                doc.fontSize(9).text(`Deadline: ${order.deadline.toLocaleDateString()}`);
            }
            if (order.requirements) {
                doc.moveDown(0.2);
                doc.fontSize(9).fillColor('#000').text('Requirements:', { underline: true });
                doc.fontSize(9).fillColor('#333').text(order.requirements, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right });
            }
            if (order.reviewSubmitted && order.review) {
                doc.moveDown(0.2);
                doc.fontSize(9).fillColor('#000').text(`Review: ${order.review.rating} / 5`);
                doc.fontSize(9).fillColor('#333').text(order.review.comment || '', { width: doc.page.width - doc.page.margins.left - doc.page.margins.right });
            }

            // New page if nearing bottom
            if (doc.y > doc.page.height - 100) {
                doc.addPage();
            }
        });

        // Summary Section
        doc.addPage();
        doc.fontSize(16).fillColor('#222').text('Summary', { underline: true });
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const byStatus = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#000').text(`Total Orders: ${orders.length}`);
        doc.fontSize(11).text(`Total Amount: $${totalRevenue.toFixed(2)}`);
        doc.moveDown(0.5);
        doc.fontSize(12).text('Orders by Status:', { underline: true });
        Object.entries(byStatus).forEach(([s, count]) => {
            doc.fontSize(10).text(`- ${s}: ${count}`);
        });

        doc.end();
    } catch (error) {
        console.error('Generate orders report error:', error);
        // If headers not sent, send JSON error; otherwise, end stream
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: 'Failed to generate PDF report' });
        }
        try { res.end(); } catch(_) {}
    }
};

// Re-export including the new function
export { generateClientOrdersReport };

// ==============================
// SINGLE ORDER RECEIPT (Client)
// ==============================
// GET /api/orders/:orderId/receipt/pdf
// Only the owning client (or admin) can download. Order must have paymentStatus === 'Paid'.
const generateOrderReceiptPDF = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const userType = req.user.userType;

        // Fetch order with related entities
        const order = await Order.findById(orderId)
            .populate('clientId', 'firstName lastName email profileImage phoneNumber')
            .populate('freelancerId', 'firstName lastName email profileImage phoneNumber')
            .populate('serviceId', 'title category description');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Authorization: only owning client or admin
        if (order.clientId._id.toString() !== userId && userType !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Ensure payment completed
        if (order.paymentStatus !== 'Paid') {
            return res.status(400).json({ success: false, message: 'Receipt available only for paid orders' });
        }

        // Prepare PDF
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const filename = `order-${order._id}-receipt.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Header / Branding
        doc.fontSize(22).fillColor('#222').text('Payment Receipt', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor('#555').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(1);
        doc.fillColor('black');

        // Order summary
        const addSectionTitle = (title) => {
            doc.moveDown(0.5);
            doc.fontSize(13).fillColor('#111').text(title, { underline: true });
            doc.fillColor('black');
            doc.moveDown(0.2);
        };

        addSectionTitle('Order Information');
        doc.fontSize(10).text(`Order ID: ${order._id}`);
        doc.text(`Service: ${order.serviceId?.title || 'Service Order'}`);
        doc.text(`Package: ${order.selectedPackage}`);
        if (order.packageDetails?.description) doc.text(`Package Description: ${order.packageDetails.description}`);
        doc.text(`Created: ${order.createdAt.toLocaleString()}`);
        doc.text(`Updated: ${order.updatedAt.toLocaleString()}`);
        if (order.deadline) doc.text(`Deadline: ${order.deadline.toLocaleDateString()}`);
        doc.text(`Status: ${order.status}`);
        doc.text(`Client Status: ${order.clientStatus || '-'}`);
        doc.text(`Freelancer Status: ${order.freelancerStatus || '-'}`);
        doc.moveDown(0.3);

        addSectionTitle('Parties');
        const clientName = order.clientId ? `${order.clientId.firstName} ${order.clientId.lastName}` : 'N/A';
        const freelancerName = order.freelancerId ? `${order.freelancerId.firstName} ${order.freelancerId.lastName}` : 'N/A';
        doc.fontSize(10).text(`Client: ${clientName}`);
        if (order.clientId?.email) doc.text(`Client Email: ${order.clientId.email}`);
        if (order.clientId?.phoneNumber) doc.text(`Client Phone: ${order.clientId.phoneNumber}`);
        doc.moveDown(0.2);
        doc.text(`Freelancer: ${freelancerName}`);
        if (order.freelancerId?.email) doc.text(`Freelancer Email: ${order.freelancerId.email}`);
        if (order.freelancerId?.phoneNumber) doc.text(`Freelancer Phone: ${order.freelancerId.phoneNumber}`);
        doc.moveDown(0.3);

        addSectionTitle('Financials');
        const basePrice = order.packageDetails?.price || (order.totalAmount || 0);
        let platformFeeAmount = 0;
        if (order.paymentDetails?.websiteFee != null) {
            platformFeeAmount = order.paymentDetails.websiteFee;
        } else if (order.totalAmount && order.packageDetails?.price) {
            // Derive fee (approx) if not stored explicitly
            platformFeeAmount = Number((order.totalAmount - order.packageDetails.price).toFixed(2));
        }
        const freelancerAmount = order.paymentDetails?.freelancerAmount != null ? order.paymentDetails.freelancerAmount : (order.totalAmount - platformFeeAmount);
        doc.fontSize(10).text(`Base Price: $${basePrice}`);
        doc.text(`Platform Fee: $${platformFeeAmount.toFixed(2)}`);
        doc.text(`Total Paid: $${order.totalAmount}`);
        doc.text(`Freelancer Amount (to be / was paid out): $${freelancerAmount.toFixed(2)}`);
        doc.text(`Payment Method: ${order.paymentMethod || 'Stripe'}`);
        doc.text(`Payment Status: ${order.paymentStatus}`);
        if (order.paymentDetails?.paidAt) doc.text(`Payout Date: ${new Date(order.paymentDetails.paidAt).toLocaleString()}`);
        if (order.paymentDetails?.transactionId) doc.text(`Transaction ID: ${order.paymentDetails.transactionId}`);
        if (order.stripePaymentIntentId) doc.text(`Stripe Payment Intent: ${order.stripePaymentIntentId}`);
        if (order.stripeSessionId) doc.text(`Stripe Session: ${order.stripeSessionId}`);
        doc.moveDown(0.3);

        if (order.requirements) {
            addSectionTitle('Client Requirements');
            doc.fontSize(10).text(order.requirements, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right });
        }

        if (order.reviewSubmitted && order.review) {
            addSectionTitle('Client Review');
            doc.fontSize(10).text(`Rating: ${order.review.rating} / 5`);
            if (order.review.comment) doc.text(`Comment: ${order.review.comment}`);
        }

        doc.moveDown(1);
        doc.fontSize(9).fillColor('#555').text('This receipt confirms payment for the above service order. Keep it for your records. If you have any questions, contact support.', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Generate order receipt error:', error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: 'Failed to generate receipt PDF' });
        }
        try { res.end(); } catch(_) {}
    }
};

export { generateOrderReceiptPDF };
