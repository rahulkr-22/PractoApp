import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DoctorCard = ({doctorObj, speciality}) => {
  const navigate=useNavigate();
  const handleClick=()=>{
    navigate(`/appointment/${doctorObj.id}`)
  }

  const nameClickHandler=()=>{
    navigate(`/doctor/${doctorObj.id}`)
  }

  return (
    <div className='flex flex-row divide-y-2 justify-around p-6'>
      <div></div>
      <div className="flex flex-row gap-40 w-1/2 bg-white ">
        <div className='flex flex-row items-center pl-10'>         
            <img className="w-28 h-28 object-cover shadow-lg rounded-full" src={doctorObj.image_url} alt="Doctor" />
          <div className='p-4'>
            <h1 onClick={nameClickHandler} className="block mt-1 text-lg leading-tight font-medium text-sky-500 hover:underline hover:cursor-pointer">{doctorObj.name}</h1>
            <div className="text-gray-500 mt-2 ">{speciality}</div>
            <p className="mt-2 text-gray-500">{doctorObj.experience} years experience overall</p>
            <p className="mt-2 text-gray-500"> <span className='font-semibold'>₹{doctorObj.fee} </span>Consultation fee at clinic</p>
          </div>
          </div>
          <div className="p-8">
            <div className="mt-6">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">Available Today</span>
            </div>
            <button onClick={handleClick} className="mt-6 bg-sky-500 text-white font-semibold px-3 py-2 rounded hover:bg-sky-700">Book Clinic Visit</button>
          </div>
      </div>
      <div></div>
    </div>

    
  )
}

export default DoctorCard