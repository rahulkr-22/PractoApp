import React, {useEffect, useState} from 'react'
import {PaymentElement,LinkAuthenticationElement,useStripe,useElements} from "@stripe/react-stripe-js";
import { Link } from 'react-router-dom';


const CheckoutForm = () => {
    const stripe= useStripe();
    const elements=useElements();

    const [email, setEmail]=useState("");
    const [message, setMessage]=useState("");
    const [isLoading, setIsLoading]=useState(false);

    useEffect(()=>{
        if(!stripe){
            return;
        }
        const clientSecret=new URLSearchParams(window.location.search).get("payment_intent_client_secret");

        if(!clientSecret){
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent})=>{
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment success");
                    break;
                case "processing":
                    setMessage("processing");
                    break;
                case "requires_payment_method":
                    setMessage("not successful, try again")
                    break;
                default:
                    setMessage("something went wrong")
                    break;
            }
        })
    },[stripe]);

    const handleSubmit=async (e)=>{
        e.preventDefault();
        
        if(!stripe || !elements){
            return;
        }

        setIsLoading(true);

        const {error}=await stripe.confirmPayment({
            elements,
            confirmParams:{
                //return_url:"http://localhost:3000/payment/success"
                return_url:"https://practo-app-delta.vercel.app/payment/success"
            }
        })

        if(error.type==="card_error" || error.type=="validation_error"){
            setMessage(error.message)
        }
        else{
            setMessage("an unexpected error occurred.")
        }
        setIsLoading(false)
    }

    const handleEmailChange=event=>{
        console.log(event);
    }

    const PaymentElementOptions={
        layout:"tabs"
    }
  return (
    <div className='flex flex-row justify-center items-center'>
        <div></div>
        <form id='payment-form' onSubmit={handleSubmit} className='w-[30%] mt-16 space-y-3 bg-white p-8 rounded-md shadow-md'>
            <LinkAuthenticationElement 
            id='link-authentication-element'
            onChange={handleEmailChange}
            />
            <PaymentElement id='payment-element' options={PaymentElementOptions}/>
            <button disabled={isLoading || !stripe || !elements} id='submit' className="mt-6 bg-sky-500 text-white font-semibold px-3 py-2 rounded hover:bg-sky-700">
                <span>
                    {isLoading ? <div className='spinner' id='spinner'></div> : "Pay now"}
                </span>
            </button>
            {message && <div id='payment-message'></div>}
        </form>
        <div></div>
    </div>
  
  )
}

export default CheckoutForm


