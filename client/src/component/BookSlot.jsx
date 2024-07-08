import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTime } from '../redux/appointmentSlice';
import { client } from '..';
import { BOOKED_SLOTS } from '../utils/queries';
import { ADD_APPOINTMENT, GET_DOCTOR } from '../utils/queries';
import { setDoctorId, setDoctorImg, setDoctorName, setFee } from '../redux/appointmentSlice';
import Header from './Header';

const BookClinic = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const userData = useSelector(state => state.user?.user);
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Relief Clinic',
    address: 'HSR Layout',
    city:'Bangalore'
  });

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

  useEffect(() => {
    client.query({
      query: BOOKED_SLOTS,
      variables: { d_id: id },
    })
    .then((result) => {
      const bookData = result.data.bookedSlots;
      const slots = bookData.map(s => s.slot);
      setBookedSlots(slots);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [id]);

  const addAppointmentFunc = async () => {
    let appointment = null;
    try {
      const result = await client.mutate({
        mutation: ADD_APPOINTMENT,
        variables: { d_id: parseInt(id), p_id: parseInt(userData.id), slot: selectedSlot, success: true },
      });
      appointment = result.data.addAppointment;
    } catch (error) {
      console.log(error);
    }
    return appointment;
  };
  const getIndianTime = () => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    };
  
    const now = new Date();
    return now.toLocaleTimeString('en-US', options);
  };
  const parseTimeToSortableString = (timeString) => {
    const [time, period] = timeString.split(' '); 
    let [hours, minutes] = time.split(':'); 
  
    hours = parseInt(hours, 10); 
    minutes = parseInt(minutes, 10);
  
    if (period === 'PM' && hours < 12) {
      hours += 12; 
    } else if (period === 'AM' && hours === 12) {
      hours = 0; 
    }
  
    // Pad hours and minutes with leading zeros for consistent string comparison
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
  
    return `${paddedHours}:${paddedMinutes}`;
  };
  function compareTimes(time1, time2){
    const parsedTime1 = parseTimeToSortableString(time1);
    const parsedTime2 = parseTimeToSortableString(time2);
    
    console.log(parsedTime1,parsedTime2)
    if (parsedTime1 < parsedTime2) {
      return false;
    } else if (parsedTime1 > parsedTime2) {
      return true;
    } else {
      return true;
    }
  };

  // Function to generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const todayIST = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000;
    todayIST.setTime(todayIST.getTime() + ISTOffset);
    for (let i = 0; i <= 23; i++) {
      const time = new Date(todayIST);
      time.setHours(i);
      time.setMinutes(0);
      const tempTime = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
      const indianTime = getIndianTime();

      if (!bookedSlots.includes(tempTime) && compareTimes(tempTime.toUpperCase(),indianTime)) {
        slots.push(tempTime);
      }
    }
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, [bookedSlots]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const goToPaymentSummary = async() => {
    if (selectedSlot) {

      if (!userData) {
        navigate('/login');
        return;
      }
  
      if (!selectedSlot || !doctor) {
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
      dispatch(setTime(selectedSlot));
      localStorage.setItem('slotTime',selectedSlot);
      navigate(`/payment-summary/${id}`); 
    } else {
      alert('Please select a time slot first.');
    }
  };

  return (
    <div>
      <Header/>
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-sky-100 text-black-800">
          <h2 className="text-lg font-bold text-center text-gray-700 mt-4">Clinic Appointment</h2>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-gray-600">{clinicInfo.name}</h3>
            <p className="text-sm text-gray-500">{clinicInfo.address}, {clinicInfo.city}</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Pick a time slot</h3>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                className={`cursor-pointer py-2 px-4 rounded ${selectedSlot === slot ? 'border border-sky-500' : 'bg-sky-100 text-sky-800'}`}
                onClick={() => handleSlotSelect(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={goToPaymentSummary}
              className="mt-6 bg-sky-500 text-white font-semibold px-3 py-2 rounded hover:bg-sky-700"
              disabled={!selectedSlot}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BookClinic;
