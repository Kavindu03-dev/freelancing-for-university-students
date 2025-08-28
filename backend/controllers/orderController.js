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

        // Handle services without packages - create default packages
        let packageDetails;
        if (!service.packages || !service.packages[selectedPackage]) {
            // Create default package based on service data
            const defaultPackages = {
                basic: {
                    name: 'Basic',
                    price: service.price,
                    description: `${service.title} - Basic Package`,
                    features: ['Basic requirements', 'Standard delivery'],
                    deliveryTime: service.deliveryTime,
                    revisions: 1
                },
                standard: {
                    name: 'Standard',
                    price: Math.round(service.price * 1.5),
                    description: `${service.title} - Standard Package`,
                    features: ['Enhanced features', 'Priority support', 'Faster delivery'],
                    deliveryTime: Math.max(1, Math.round(service.deliveryTime * 0.8)),
                    revisions: 2
                },
                premium: {
                    name: 'Premium',
                    price: Math.round(service.price * 2.5),
                    description: `${service.title} - Premium Package`,
                    features: ['All features', 'Premium support', 'Fastest delivery', 'Unlimited revisions'],
                    deliveryTime: Math.max(1, Math.round(service.deliveryTime * 0.6)),
                    revisions: 3
                }
            };
            
            packageDetails = defaultPackages[selectedPackage];
            
            // Update the service with packages for future use
            await Service.findByIdAndUpdate(serviceId, {
                $set: { packages: defaultPackages }
            });
        } else {
            packageDetails = service.packages[selectedPackage];
        }

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
        const { status } = req.body;
        const userId = req.user.id;

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user has permission to update this order
        if (order.freelancerId.toString() !== userId && req.user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Validate status transition
        const validTransitions = {
            'Payment Confirmed': ['In Progress'],
            'In Progress': ['Review', 'Revision'],
            'Review': ['Completed', 'Revision'],
            'Revision': ['In Progress', 'Review']
        };

        if (validTransitions[order.status] && !validTransitions[order.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status transition from ${order.status} to ${status}`
            });
        }

        order.status = status;
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

export {
    placeOrderStripe,
    verifyStripePayment,
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder
};
