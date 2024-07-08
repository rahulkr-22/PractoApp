import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { IoMdCalendar } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { BiClinic } from "react-icons/bi";


const Card = () => {
  const navigate = useNavigate();
 // const timeSlot = useSelector(store => store.appointment.time);
  const timeSlot=localStorage.getItem('slotTime');
  const userData = useSelector(state => state.user?.user);
  const bookData = JSON.parse(localStorage.getItem('book'));

  const getDate=()=>{
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' };
    const indiaLocale = 'en-IN';
    const date = new Date();
    const formattedDate = date.toLocaleDateString(indiaLocale, options);
    return formattedDate;
  }

  const handlePayment = () => {
      navigate('/payment');
  }
  return (
      <div className='flex flex-row justify-center mt-20 '>
          <div className='flex flex-col w-1/4 divide-y-2 divide-gray-200 text-gray-700 bg-white rounded shadow-md' >
              <div className='p-4 flex flex-row justify-normal items-center gap-2' >
              <BiClinic className="text-white bg-sky-500 rounded-full p-1" size={24} />
                   <div className='text-gray-700 font-bold text-lg'>In-Clinic Appointment</div>
              </div>
              <div className='flex flex-row justify-around items-center h-20 p-4' >
                  <IoMdCalendar/>
                  <div>On <span className='font-semibold mr-36'>July 8, 2024</span></div>
                  <FiClock/>
                  <div className='font-semibold' >At {timeSlot}</div>
              </div>
              <div className='flex flex-row justify-around p-4'>
                  <img className='w-24 h-24' src={bookData.image_url} />
                  <div className='ml-10'>
                      <p className='font-semibold'>{bookData.doctorName}</p>
                      <p>BDS, MDS - Orthodontics
                          Orthodontist, Implantologist, Dentist, Dental Surgeon</p></div>
              </div>
              <div className='flex flex-row justify-around p-4'>
                  <img className='w-24 h-24' src='https://images1-fabric.practo.com/practices/1163292/excel-dental-care-bangalore-5a03f54887a09.jpeg' />
                  <div>
                      <p className='ml-3 font-semibold'>Relief Clinic</p>
                      <div className='ml-3'>884, 19th Main, 39th Cross, Jayanagar 4th T Block, Bangalore</div>
                  </div>

              </div>
          </div>
          <div className='flex flex-col justify-start gap-4 ml-20 p-2 text-gray-700 text-xl'>
              <div className='flex flex-row justify-start'>
                  <h1 className='mb-8 font-bold text-3xl text-gray-700'>Payment Summary</h1>
              </div>
              <div>
                  <p>Patient Name</p>
                  <h3 className='font-semibold'>{userData.name}</h3>
              </div>
              <div>
                  <p>Mobile</p>
                  <h3 className='font-semibold'>+91 {userData.contact}</h3>
              </div>
              <div>
                  <p>Appointment Charges</p>
                  <h3 className='font-semibold'>₹{bookData.fee}</h3>
              </div>
              <div className='flex justify-center mt-4 justify-self-auto'>
                  <button className=" bg-sky-500 text-white font-semibold px-3 py-2 rounded hover:bg-sky-700" onClick={handlePayment}>Pay Now</button>
              </div>
          </div>
      </div>
  )
}

const PaymentSummary = () => {
  return (
    <div>
      <Header />
      <Card/>
    </div>
  );
};

export default PaymentSummary;
