import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkmark } from 'react-checkmark';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/appointment/status');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-sm w-full bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Checkmark size='36px' />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2 mt-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Thank you for your payment. Your transaction was successful.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
