import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_APPOINTMENT, GET_DOCTOR } from '../utils/queries';
import { client } from '..';
import { setDoctorId, setDoctorImg, setDoctorName, setFee } from '../redux/appointmentSlice';
import Header from './Header';

const PaymentSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const timeSlot = useSelector(store => store.appointment.time);
  const userData = useSelector(state => state.user?.user);

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

  const addAppointmentFunc = async () => {
    let appointment = null;
    try {
      const result = await client.mutate({
        mutation: ADD_APPOINTMENT,
        variables: { d_id: parseInt(id), p_id: parseInt(userData.id), slot: timeSlot, success: true },
      });
      appointment = result.data.addAppointment;
    } catch (error) {
      console.log(error);
    }
    return appointment;
  };

  const handleClick = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    if (!timeSlot || !doctor) {
      alert('Please select a time slot and ensure the doctor information is loaded.');
      return;
    }

    const appointment = await addAppointmentFunc();

    if (!appointment) {
      alert('Error creating appointment. Please try again.');
      return;
    }

    const book = {
      doctorId: parseInt(id),
      doctorName: doctor.name,
      fee: doctor.fee,
      image_url: doctor.image_url,
      appointmentNumber: appointment.id,
    };

    localStorage.setItem('book', JSON.stringify(book));
    dispatch(setDoctorId(parseInt(id)));
    dispatch(setDoctorName(doctor.name));
    dispatch(setFee(doctor.fee));
    dispatch(setDoctorImg(doctor.image_url));
    navigate('/payment');
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-8 p-4">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-100 text-gray-700">
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
              {doctor ? (
                <>
                  <p className="text-sm">Doctor Name: {doctor.name}</p>
                  <p className="text-sm">Fee: ₹ {doctor.fee}</p>
                </>
              ) : (
                <p className="text-sm text-red-500">Loading doctor details...</p>
              )}
              <p className="text-sm">Time: {timeSlot}</p>
            </div>
            <div className="mt-4">
              <button onClick={handleClick} className="mt-6 bg-sky-500 text-white font-semibold px-3 py-2 rounded hover:bg-sky-700">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
