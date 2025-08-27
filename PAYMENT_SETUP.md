# Payment Gateway Setup Guide

This guide explains how to set up the Stripe payment gateway for the freelancing platform.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Node.js and npm installed
3. MongoDB running

## Backend Setup

### 1. Install Dependencies

The Stripe package has already been installed. If you need to reinstall:

```bash
cd backend
npm install stripe
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/freelancing-platform

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Get Your Stripe Keys

1. Log into your Stripe Dashboard
2. Go to Developers → API keys
3. Copy your publishable key (starts with `pk_test_` or `pk_live_`)
4. Copy your secret key (starts with `sk_test_` or `sk_live_`)

**Important**: Use test keys during development. Switch to live keys only when going to production.

## Frontend Setup

The frontend components have been created and integrated:

- `PaymentModal.jsx` - Handles order placement and redirects to Stripe
- `OrderSuccessPage.jsx` - Shows after successful payment
- `OrderCancelPage.jsx` - Shows when payment is cancelled
- `OrdersPage.jsx` - Lists all orders for the user

## How It Works

### 1. Order Flow

1. User clicks "Order Now" on a service
2. PaymentModal opens with package selection and requirements
3. User fills in project requirements and deadline
4. Clicks "Proceed to Payment"
5. Backend creates order and Stripe checkout session
6. User is redirected to Stripe checkout
7. After payment, user is redirected to success/cancel page

### 2. Payment Verification

1. Stripe redirects to success page with session ID
2. Frontend calls backend to verify payment
3. Backend verifies with Stripe and updates order status
4. Order is marked as "Payment Confirmed"

### 3. Order Management

- Clients can view their orders and track progress
- Freelancers can view orders they're working on
- Both can update order status through the system

## API Endpoints

### Orders

- `POST /api/orders/stripe` - Create order and Stripe session
- `POST /api/orders/verify` - Verify Stripe payment
- `GET /api/orders/all` - Get all orders for user
- `GET /api/orders/details/:orderId` - Get order details
- `PUT /api/orders/status/:orderId` - Update order status
- `DELETE /api/orders/:orderId` - Cancel order

## Testing

### Test Cards

Use these test card numbers in Stripe checkout:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Mode

The system is configured for test mode by default. All payments will be test transactions with no real money involved.

## Security Features

1. **Authentication Required**: All order endpoints require valid JWT tokens
2. **User Authorization**: Users can only access their own orders
3. **Stripe Webhooks**: Payment verification is done server-side
4. **Input Validation**: All inputs are validated before processing

## Platform Fees

The system automatically adds a 10% platform fee to all orders. This is calculated and displayed transparently to users.

## Error Handling

The system handles various error scenarios:

- Payment failures
- Network errors
- Invalid inputs
- Authentication failures
- Order not found

## Future Enhancements

Potential improvements to consider:

1. **Webhook Support**: Real-time payment updates
2. **Refund System**: Automated refund processing
3. **Multiple Payment Methods**: Support for other gateways
4. **Subscription Billing**: Recurring payments
5. **Escrow System**: Hold payments until project completion

## Troubleshooting

### Common Issues

1. **Payment Not Processing**: Check Stripe keys and network connectivity
2. **Orders Not Creating**: Verify MongoDB connection and user authentication
3. **Redirect Issues**: Ensure success/cancel URLs are correctly configured

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Support

For issues related to:
- **Stripe**: Contact Stripe support
- **Platform**: Check the application logs and error messages
- **Development**: Review the code comments and API documentation
