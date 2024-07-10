import React,{useState,useEffect} from 'react'
import { CANCEL_APPOINTMENT, CLINIC_DETAIL, GET_DOCTOR } from '../utils/queries';
import { client } from '..';
import toast from 'react-hot-toast';

const AppointmentCard = ({appointment}) => {
  const [clinicInfo,setClinicInfo]=useState(null);
  const [doctor,setDoctor]=useState(null);
  const [isDisabled,setIsDisabled]=useState(!appointment.success)

  useEffect(()=>{
    client.query({
        query: CLINIC_DETAIL,
        variables: { id: appointment.c_id},
      })
      .then(result => {
        if (result.data && result.data.clinic) {
          setClinicInfo(result.data.clinic);
        }
      })
      .catch(error => {
        console.error('Error fetching clinic:', error);
      });

      client.query({
        query: GET_DOCTOR,
        variables: { id: appointment.d_id },
      })
        .then(result => {
          if (result.data && result.data.doctor) {
            setDoctor(result.data.doctor);
          }
        })
        .catch(error => {
          console.error('Error fetching doctor:', error);
        });
  },[])

  const handleClickCancel = async () => {
    await client.mutate({
        mutation: CANCEL_APPOINTMENT,
        variables: { id: appointment.id }
    })
        .then((result) => {
            toast.success('Your appointment is cancelled.');
            setIsDisabled(true)
        })
        .catch((error) => console.log(error));
    };
  return (
    <div  >
    {doctor && clinicInfo?
    (<div className='container mx-auto justify-center items-center border-sm p-4 border-b-8 bg-white w-[40%]'>
      <div className='flex flex-col gap-y-3'>
          <div className='flex flex-row gap-8 items-center'>
          <img className='w-16 rounded-full' src={doctor.image_url}/>
          <div>
          <p className='font-bold text-gray-700'>{doctor.name}</p>
          <p className='font-md text-gray-600'>{doctor.experience} Years experience</p>
          </div>
          <div className='flex flex-col gap-1 items-center justify-center ml-36'>
          <p className='font-semibold text-gray-600'> <span className='font-bold'>₹{doctor.fee}</span> consultation fee </p>
          <p className='font-semibold text-green-500'>{appointment.slot}</p>
          </div>
          </div>
          <div className='flex flex-row gap-5 items-center'>
            <img className='w-20' src='https://images1-fabric.practo.com/practices/1163292/excel-dental-care-bangalore-5a03f54887a09.jpeg'/>
            <div>
          <p className='font-bold text-gray-700'>{clinicInfo.name}</p>
          <p className='font-md text-gray-600'>{clinicInfo.address}, {clinicInfo.city}</p>
          </div>
          <button className="ml-36 bg-white font-semibold border-2 border-sky-400 rounded p-1 px-2 text-sky-400 hover:bg-sky-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:ml-44 disabled:border-red-500 disabled:bg-red-500 disabled:text-white" onClick={handleClickCancel} disabled={isDisabled}>
            {isDisabled?'Cancelled' : 'Cancel Appointment' }</button>
          </div>

      </div>
    </div>)
    :(<p></p>)    
    }
    </div>
  )
}

export default AppointmentCard