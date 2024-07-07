import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DoctorCard = ({doctorObj, speciality}) => {
  const navigate=useNavigate();
  const handleClick=()=>{
    // navigate(`/book/${doctorObj.id}`)
  }

  return (
    <div className='flex flex-row justify-around'>
      <div></div>
      <div className="flex flex-row gap-40 w-1/2 bg-white shadow-md rounded-lg">
        <div className='flex flex-row items-center pl-10'>         
            <img className="w-28 h-28 object-cover shadow-lg rounded-full" src={doctorObj.image_url} alt="Doctor" />
          <div className='p-4'>
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{speciality}</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">{doctorObj.name}</h1>
            <p className="mt-2 text-gray-500">{doctorObj.experience} years experience overall</p>
            <p className="mt-2 text-gray-500">₹{doctorObj.fee} Consultation fee at clinic</p>
          </div>
          </div>
          <div className="p-8">
            <div className="mt-6">
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">Available Today</span>
            </div>
            <Link to={`/doctor/${doctorObj.id}`} className="mt-6 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
            View Profile
          </Link>
            <button onClick={handleClick} className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Book Clinic Visit</button>
          </div>
      </div>
      <div></div>
    </div>

    
  )
}

export default DoctorCard