import express from 'express';
import { 
    placeOrderStripe, 
    verifyStripePayment,
    getAllOrders, 
    getOrderDetails, 
    updateOrderStatus,
    cancelOrder,
    markOrderAsPaidByAdmin,
    sendMoneyToFreelancer
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

export default orderRouter;
