import React from 'react'
import Header from './Header'
import { Checkmark } from 'react-checkmark'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { client } from '..'
import { CANCEL_APPOINTMENT } from '../utils/queries'
import { IoMdCalendar } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { BiClinic } from "react-icons/bi";


const Card = () => {
    const navigate = useNavigate();
   // const timeSlot = useSelector(store => store.appointment.time);
   const timeSlot=localStorage.getItem('slotTime');
    const userData = useSelector(state => state.user?.user);
    const bookData = JSON.parse(localStorage.getItem('book'));

    const handleClickCancel = async () => {
        await client.mutate({
            mutation: CANCEL_APPOINTMENT,
            variables: { id: parseInt(bookData.appointmentNumber) }
        })
            .then((result) => {

            })
            .catch((error) =>
                console.log(error))

        toast.success('Your appointment is cancelled.');
        setTimeout(() => {
            navigate('/')
        }, 2000)
    }
    const handleClickHome = () => {
        navigate('/');
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
            <div className='flex flex-col justify-start gap-4 ml-10 p-2 text-gray-700'>
                <div className='flex flex-row justify-start'>
                    <Checkmark size='32px' />
                    <h1 className='ml-2 font-semibold text-2xl text-gray-800'>Appointment Confirmed</h1>
                </div>
                <div className='ml-4 flex flex-col gap-y-2 mt-4'>
                <div>
                    <p className='text-gray-800'>Your appointment ID is {bookData.appointmentNumber}</p>
                    <p>We have sent you an SMS with the details.</p>
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
                </div>
                <div className='flex flex-row gap-x-9 mt-4 ml-4'>
                    <button className="bg-white font-semibold border-2 border-sky-400 rounded p-1 px-2 text-sky-400 hover:bg-sky-400 hover:text-white" onClick={handleClickCancel}>Cancel Appointment</button>
                    <button
                        className="bg-sky-400 text-white font-semibold rounded p-1 px-2   hover:bg-sky-500 "
                        onClick={handleClickHome}
                    >
                        Back To Home
                    </button>


                </div>
            </div>
        </div>
    )
}

const AppointmentConfirmation = () => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    return (
        <div>
            <Header />
            <Card />
        </div>
    )
}

export default AppointmentConfirmation
