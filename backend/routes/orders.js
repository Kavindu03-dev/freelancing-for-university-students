import express from 'express';
import { 
    placeOrderStripe, 
    verifyStripePayment,
    getAllOrders, 
    getOrderDetails, 
    updateOrderStatus,
    cancelOrder,
    markOrderAsPaidByAdmin,
    sendMoneyToFreelancer,
    addOrderReview,
    generateClientOrdersReport,
    generateOrderReceiptPDF
} from '../controllers/orderController.js';
import { protect as authUser } from '../middleware/auth.js';

const orderRouter = express.Router();

// Protected routes - require authentication
orderRouter.use(authUser);

// Order creation and payment
orderRouter.post('/stripe', placeOrderStripe);
orderRouter.post('/verify', verifyStripePayment);

// Order management
orderRouter.get('/all', getAllOrders);
orderRouter.get('/details/:orderId', getOrderDetails);
orderRouter.put('/status/:orderId', updateOrderStatus);
orderRouter.delete('/:orderId', cancelOrder);

// Admin only - mark completed orders as paid
orderRouter.put('/:orderId/mark-paid', markOrderAsPaidByAdmin);

// Admin only - send money to freelancer's wallet
orderRouter.put('/:orderId/send-money-to-freelancer', sendMoneyToFreelancer);

// Client adds review for order (service)
orderRouter.post('/:orderId/review', addOrderReview);

// Client PDF orders report download
orderRouter.get('/report/pdf', generateClientOrdersReport);

// Single paid order receipt download
orderRouter.get('/:orderId/receipt/pdf', generateOrderReceiptPDF);

export default orderRouter;
