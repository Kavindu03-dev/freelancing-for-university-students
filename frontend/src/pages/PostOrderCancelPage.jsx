import React from 'react';
import { Link } from 'react-router-dom';

const PostOrderCancelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <span className="text-yellow-600 text-2xl">⚠</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your post order payment was cancelled. No charges were made to your account.
          </p>
          
          <div className="space-y-3">
            <Link 
              to="/opportunities" 
              className="block w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Browse More Opportunities
            </Link>
            <Link 
              to="/dashboard" 
              className="block w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOrderCancelPage;
