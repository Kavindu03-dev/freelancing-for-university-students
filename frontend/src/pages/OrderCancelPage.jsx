import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const OrderCancelPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <span className="text-yellow-600 text-2xl">⚠</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Session ID:</span> {sessionId}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                If you have any questions, please contact support with this ID.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link 
              to="/services" 
              className="block w-full bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Browse Services
            </Link>
            <Link 
              to="/" 
              className="block w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Need help? Contact our support team.</p>
            <p className="mt-2">
              You can try placing your order again whenever you're ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelPage;
