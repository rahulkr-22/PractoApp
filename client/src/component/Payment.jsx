import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useSelector } from 'react-redux';
import { CREATE_PAYMENT_INTENT } from '../utils/queries';
import { client } from '..';
import { STRIPE_KEY } from '../utils/secret';

const stripePromise = loadStripe(STRIPE_KEY);

export default function Payment() {
  const [clientSecret, setClientSecret] = useState("");
  const {fee}=useSelector(state=>state.appointment);
  const {id}=useSelector(state=>state.user);
  

  useEffect(() => {
   
    client.mutate({
      mutation: CREATE_PAYMENT_INTENT,
      variables: { amount: fee*100 }
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
