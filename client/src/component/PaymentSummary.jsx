import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { ADD_APPOINTMENT, GET_DOCTOR } from '../utils/queries';
import { client } from '..';
import { setDoctorId, setDoctorImg, setDoctorName, setFee } from '../redux/appointmentSlice';



const PaymentSummary = () => {
  const navigate=useNavigate();
  const {id}=useParams();
  const [doctor, setDoctor] = useState(null);
  let appointment=null;
  const dispatch=useDispatch();
  const timeSlot=useSelector(store=>store.appointment.time);

  const userData=useSelector(state=>state.user?.user);

  useEffect(() => {
      client.query({
        query: GET_DOCTOR,
        variables: { id: parseInt(id) },
      })
      .then(result => {
        if (result.data && result.data.doctor) {
          setDoctor(result.data.doctor);
        }
      })
      .catch(error => {
        console.error('Error fetching doctor:', error);
      });
  }, [id]);

  const clinicInfo = {
    name: 'Relief Clinic',
    location: 'HSR Layout, Bangalore',
  };

  const addAppointmentFunc=async()=>{
    await client.mutate({
      mutation:ADD_APPOINTMENT,
      variables:{d_id:parseInt(id),p_id:parseInt(userData.id),slot:timeSlot,success:true}
    })
    .then((result)=>{
      appointment=result.data.addAppointment;
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  const handleClick=async()=>{
    if(!userData){
      navigate('/login');
      return;
    }

    if(timeSlot) await addAppointmentFunc();
    

    const book={
      doctorId:parseInt(id),
      doctorName:doctor.name,
      fee:doctor.fee,
      image_url:doctor.image_url,
      appointmentNumber:appointment?.id,
    }

    localStorage.setItem('book',JSON.stringify(book));
    dispatch(setDoctorId(parseInt(id)));
    dispatch(setDoctorName(doctor.name));
    dispatch(setFee(doctor.fee));
    dispatch(setDoctorImg(doctor.image_url));
    navigate('/appointment/status')
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-100 text-blue-800">
          <h2 className="text-lg font-semibold">Payment Summary</h2>
          <p className="text-sm mt-1">Clinic Appointment</p>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{clinicInfo.name}</h3>
            <p className="text-sm">{clinicInfo.location}</p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-2">Appointment Details</h3>
            {/* <p className="text-sm">Date: 05/07/2024</p> */}
          {/* <p className='text-lg'>Doctor Name: {doctor.name}</p> */}
            <p className="text-sm">Time: {timeSlot}</p>
            <p className="text-sm">Fee: ₹ 200</p>
          </div>
          <div className="mt-4">
            <button onClick={handleClick} className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">
              Pay Now 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
