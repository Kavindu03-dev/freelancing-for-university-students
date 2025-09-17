import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserData } from '../utils/auth';

const PaymentModal = ({ isOpen, onClose, service, selectedPackage }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requirements: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }

    // Validate service availability
    if (!service) {
      setError('Service information is missing');
      return;
    }
    
    if (!service.isActive) {
      setError('This service is currently not available for orders');
      return;
    }
    
    if (!service.packages || !service.packages[selectedPackage]) {
      setError('Selected package is not available');
      return;
    }

    // Validate form
    if (!formData.requirements.trim()) {
      setError('Please provide project requirements');
      return;
    }

    if (!formData.deadline) {
      setError('Please select a deadline');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('userToken');
      console.log('Token found:', token ? 'Yes' : 'No');
      console.log('User data:', localStorage.getItem('userData'));
      
      if (!token) {
        setError('You must be logged in to place an order');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/orders/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: service._id,
          selectedPackage: selectedPackage,
          requirements: formData.requirements,
          deadline: formData.deadline
        })
      });
      
      console.log('Request payload:', {
        serviceId: service._id,
        selectedPackage: selectedPackage,
        requirements: formData.requirements,
        deadline: formData.deadline
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();
      console.log('Response result:', result);
      console.log('Response error details:', result.error || result.message);

      if (result.success) {
        // Redirect to Stripe checkout
        window.location.href = result.session_url;
      } else {
        setError(result.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPackageDetails = () => {
    console.log('Service object:', service);
    console.log('Service ID:', service?._id);
    console.log('Service title:', service?.title);
    console.log('Service isActive:', service?.isActive);
    console.log('Service status:', service?.status);
    console.log('Service freelancerId:', service?.freelancerId);
    console.log('Selected package:', selectedPackage);
    console.log('Service packages:', service?.packages);
    console.log('Basic package details:', service?.packages?.basic);
    
    // Check if service is available for orders
    if (!service) {
      console.error('No service data provided');
      return null;
    }
    
    if (!service.isActive) {
      console.error('Service is not active');
      return null;
    }
    
    if (!service.packages) {
      console.error('Service has no packages');
      return null;
    }
    
    return service.packages[selectedPackage];
  };

  const packageDetails = getPackageDetails();
  const platformFee = packageDetails ? packageDetails.price * 0.10 : 0;
  const totalAmount = packageDetails ? packageDetails.price + platformFee : 0;

  return (
         <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-black via-yellow-500 to-black rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-[4px] animate-slideInUp shadow-2xl transform transition-all duration-500 hover:scale-105">
         <div className="bg-white rounded-lg w-full h-full overflow-y-auto">
           <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Place Order</h2>
                         <button
               onClick={onClose}
               className="text-gray-500 hover:text-gray-700 text-2xl transition-all duration-300 hover:scale-110 hover:rotate-90"
             >
               ×
             </button>
          </div>

          {service && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {service.freelancerName} • {service.category}
              </p>
              
              {/* Debug info removed for production */}
              
              {packageDetails && (
                                 <div className="bg-gray-50 p-4 rounded-lg mb-4 transition-all duration-300 hover:bg-gray-100 hover:shadow-md transform hover:-translate-y-1">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {packageDetails.name} Package
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {packageDetails.description}
                  </p>
                  <ul className="text-sm text-gray-600 mb-3">
                    {packageDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center mb-1">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-sm">
                    <span>Delivery: {packageDetails.deliveryTime} {service.deliveryUnit}</span>
                    <span>Revisions: {packageDetails.revisions}</span>
                  </div>
                </div>
              )}
            </div>
          )}

                     <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Requirements *
              </label>
                             <textarea
                 name="requirements"
                 value={formData.requirements}
                 onChange={handleInputChange}
                 rows="4"
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-400 hover:shadow-md transform hover:-translate-y-1"
                 placeholder="Describe your project requirements in detail..."
                 required
               />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
                             <input
                 type="date"
                 name="deadline"
                 value={formData.deadline}
                 onChange={handleInputChange}
                 min={new Date().toISOString().split('T')[0]}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 hover:border-yellow-400 hover:shadow-md transform hover:-translate-y-1"
                 required
               />
            </div>

                         {error && (
               <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md animate-bounce transition-all duration-300">
                 {error}
               </div>
             )}

            {packageDetails && (
                             <div className="bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md transform hover:-translate-y-1">
                <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Package Price:</span>
                    <span>${packageDetails.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (10%):</span>
                    <span>${platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 font-semibold">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
                             <button
                 type="button"
                 onClick={onClose}
                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all duration-300 hover:border-gray-400 hover:shadow-md transform hover:-translate-y-1 active:translate-y-0"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 disabled={loading}
                 className="flex-1 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? 'Processing...' : 'Proceed to Payment'}
               </button>
            </div>
          </form>

                     <div className="mt-4 text-xs text-gray-500 text-center">
             By placing this order, you agree to our terms of service and payment policies.
           </div>
         </div>
       </div>
       </div>
    </div>
  );
};

export default PaymentModal;
