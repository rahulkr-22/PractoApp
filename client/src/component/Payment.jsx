import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useSelector } from 'react-redux';
import { CREATE_PAYMENT_INTENT } from '../utils/queries';
import { client } from '..';
import { STRIPE_KEY } from '../utils/secret';

const stripePromise = loadStripe('pk_test_51NlOhRSEekknxcXvVcTFOuipmh3dAq4ZuLhojfy1ARIyOVkV94RON9pXEKUhaDbVHDmXpenRHjEMOYm1kfg5bTjf00vxsMXbCR');

export default function Payment() {
  const [clientSecret, setClientSecret] = useState("");
  // const {fee}=useSelector(state=>state.appointment);
  const {id}=useSelector(state=>state.user);
  const bookData=JSON.parse(localStorage.getItem('book'));
  

  useEffect(() => {
   
    client.mutate({
      mutation: CREATE_PAYMENT_INTENT,
      variables: { amount: bookData.fee*100 }
    })
    .then(result => {
      setClientSecret(result.data.createPaymentIntent.clientSecret);
    })
    .catch(error => {
      console.log("Error creating payment intent:", error);
    });
  }, [id]);

  const appearance = {
    theme: "stripe"
  };
  
  const options = {
    clientSecret,
    appearance
  };

  return (
    <div>
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
