import React, { useEffect,useSelector, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkmark } from 'react-checkmark';
import { ADD_APPOINTMENT } from '../utils/queries';
import { client } from '..';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const bookData=JSON.parse(localStorage.getItem('book'))
  const userData = JSON.parse(localStorage.getItem('user'));
  const [appId,setAppId]=useState(13);
  const clinicId=bookData.clinicId;
  const slotTime=localStorage.getItem('slotTime')


  useEffect(() => {

    client.mutate({
      mutation: ADD_APPOINTMENT,
      variables: { d_id: bookData.doctorId, p_id:userData.id,c_id:clinicId, slot: slotTime, success: true },
    }).then((result)=>{
      setAppId(result?.data?.addAppointment?.id)
    }).catch((error)=>{
      console.log(error)
    })

    localStorage.setItem('appNum',appId);
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
