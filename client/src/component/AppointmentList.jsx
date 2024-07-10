import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import DoctorCard from './DoctorCard.jsx';
import { client } from '../index.js';
import { GET_APPOINTMENT_USER, GET_USER_BY_EMAIL, SEARCH_DOCTORS } from '../utils/queries.js';
import Loading from './Loading.jsx';
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';
import AppointmentCard from './AppointmentCard.jsx';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = useSelector(state => state.user?.user);

  useEffect(() => {
    if (!userData) {
      return;
    }

    setLoading(true);

    client.query({
      query: GET_APPOINTMENT_USER,
      variables: {
        p_id: userData.id
      },
    })
    .then((result) => {
      if (result.data && result.data.appointmentByPatient) {
        setAppointments(result.data.appointmentByPatient);
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    });

  }, [userData]);


  return (
    <div>
      <Header/>

      <div className='flex justify-center font-semibold text-lg text-gray-700 mb-3 mt-4'>
        Showing your Appointments 
      </div>

      <div className='flex flex-col justify-center'>
        {loading ? <Loading /> : (
          appointments.map(appointment => (
            <AppointmentCard appointment={appointment}/>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
