# Post Payment System

This document explains the payment system for posts (job opportunities) that has been implemented alongside the existing gigs payment system.

## Overview

The post payment system allows students/freelancers to apply for job opportunities posted by clients by making a payment. This creates a PostOrder that tracks the project from application to completion.

## System Architecture

### Backend Components

1. **PostOrder Model** (`backend/models/PostOrder.js`)
   - Stores post order information including client, freelancer, post details, payment status, and order status
   - Similar structure to the existing Order model but specifically for posts

2. **Post Order Controller** (`backend/controllers/postOrderController.js`)
   - Handles creating post orders with Stripe payments
   - Manages payment verification
   - Provides CRUD operations for post orders
   - Includes status management and cancellation logic

3. **Post Order Routes** (`backend/routes/postOrders.js`)
   - RESTful API endpoints for post order management
   - All routes require authentication

4. **Server Integration** (`backend/server.js`)
   - New routes mounted at `/api/post-orders`

### Frontend Components

1. **PostPaymentModal** (`frontend/src/components/PostPaymentModal.jsx`)
   - Modal for students to apply for opportunities
   - Collects project requirements and proposed deadline
   - Shows order summary with platform fees
   - Redirects to Stripe checkout

2. **PostOrderSuccessPage** (`frontend/src/pages/PostOrderSuccessPage.jsx`)
   - Displays after successful payment
   - Verifies payment with backend
   - Shows order details and confirmation

3. **PostOrderCancelPage** (`frontend/src/pages/PostOrderCancelPage.jsx`)
   - Displays when payment is cancelled
   - Provides navigation options

4. **PostOrdersPage** (`frontend/src/pages/PostOrdersPage.jsx`)
   - Lists all post orders for the user
   - Shows statistics and order management
   - Different views for clients vs freelancers

5. **Updated StudentDashboard**
   - Integrates PostPaymentModal for opportunity applications
   - Replaces old application form with payment flow

## How It Works

### 1. Student Applies for Opportunity

1. Student browses available opportunities in their dashboard
2. Clicks "Apply" on a post they're interested in
3. PostPaymentModal opens showing:
   - Post details (title, type, category, budget, location)
   - Form for project requirements and proposed deadline
   - Order summary with platform fee calculation

### 2. Payment Process

1. Student fills out requirements and deadline
2. Clicks "Proceed to Payment"
3. Backend creates PostOrder with status "Pending"
4. Stripe checkout session is created
5. Student is redirected to Stripe for payment
6. After payment, redirected to success/cancel page

### 3. Payment Verification

1. Success page calls backend to verify payment
2. Backend checks Stripe session status
3. If paid, PostOrder status updated to "Payment Confirmed"
4. Order is now active and ready for work

### 4. Order Management

1. **Status Flow**: Pending → Payment Confirmed → In Progress → Review → Completed
2. **Payment Status**: Pending → Paid → Failed/Refunded
3. Both client and freelancer can update order status
4. Orders can be cancelled with automatic refunds

## API Endpoints

### Post Orders

- `POST /api/post-orders/stripe` - Create post order and Stripe session
- `POST /api/post-orders/verify` - Verify Stripe payment
- `GET /api/post-orders/all` - Get all post orders for user
- `GET /api/post-orders/:orderId` - Get post order details
- `PUT /api/post-orders/:orderId/status` - Update order status
- `DELETE /api/post-orders/:orderId` - Cancel order

## Database Schema

### PostOrder Collection

```javascript
{
  clientId: ObjectId,        // Reference to User (client)
  freelancerId: ObjectId,    // Reference to User (freelancer)
  postId: ObjectId,          // Reference to Post
  postDetails: {              // Snapshot of post details
    title: String,
    type: String,
    category: String,
    budget: Number,
    description: String,
    requiredSkills: [String],
    degreeField: String,
    location: String
  },
  totalAmount: Number,        // Budget + platform fee
  requirements: String,       // Freelancer's project approach
  deadline: Date,            // Proposed completion date
  status: String,            // Order workflow status
  paymentStatus: String,     // Payment status
  stripeSessionId: String,   // Stripe checkout session
  stripePaymentIntentId: String, // Stripe payment intent
  createdAt: Date,
  updatedAt: Date
}
```

## Platform Fees

- **10% platform fee** added to all post orders
- Fee is calculated on the post budget amount
- Fee is displayed transparently to users
- Fee is included as separate line item in Stripe checkout

## User Experience Flow

### For Students/Freelancers

1. **Browse Opportunities**: View available posts in dashboard
2. **Apply**: Click apply button to open payment modal
3. **Payment**: Complete Stripe checkout process
4. **Confirmation**: See success page with order details
5. **Track Progress**: Monitor order status in post orders page
6. **Complete Work**: Update status as project progresses

### For Clients

1. **Post Creation**: Create job opportunities (existing functionality)
2. **Order Management**: View and manage incoming orders
3. **Progress Tracking**: Monitor freelancer progress
4. **Status Updates**: Approve work and manage revisions
5. **Completion**: Mark orders as completed

## Security Features

1. **Authentication Required**: All endpoints require valid JWT tokens
2. **User Authorization**: Users can only access their own orders
3. **Stripe Integration**: Secure payment processing
4. **Input Validation**: All inputs validated before processing
5. **Status Validation**: Order status transitions are controlled

## Integration Points

### Existing Systems

- **User Authentication**: Uses existing auth middleware
- **Post Management**: Integrates with existing Post model
- **Stripe Setup**: Uses existing Stripe configuration
- **Dashboard Integration**: Seamlessly integrated into existing dashboards

### New Features

- **Post Orders**: New order type for job opportunities
- **Payment Flow**: Dedicated payment process for posts
- **Order Management**: Comprehensive order tracking system
- **Status Workflow**: Structured project progression

## Testing

### Test Cards

Use these Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

### Test Scenarios

1. **Successful Application**: Complete payment flow
2. **Payment Cancellation**: Cancel during Stripe checkout
3. **Payment Failure**: Use declined card
4. **Order Management**: Update statuses and cancel orders
5. **Access Control**: Verify user permissions

## Future Enhancements

1. **Escrow System**: Hold payments until project completion
2. **Milestone Payments**: Break payments into project phases
3. **Dispute Resolution**: Handle conflicts between parties
4. **Automated Invoicing**: Generate invoices for completed work
5. **Rating System**: Post-project feedback and ratings

## Troubleshooting

### Common Issues

1. **Payment Not Processing**: Check Stripe keys and network
2. **Orders Not Creating**: Verify MongoDB connection and auth
3. **Redirect Issues**: Ensure success/cancel URLs are correct
4. **Status Updates Failing**: Check user permissions and status transitions

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in environment variables.

## Support

For technical issues:
- Check application logs for error details
- Verify Stripe dashboard for payment status
- Ensure all environment variables are set correctly
- Test with Stripe test keys before going live

## Conclusion

The post payment system provides a complete solution for monetizing job opportunities while maintaining the same security and user experience standards as the existing gigs system. It seamlessly integrates with the current platform architecture and provides a foundation for future enhancements.
