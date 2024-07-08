import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTime } from '../redux/appointmentSlice';
import { client } from '..';
import { BOOKED_SLOTS } from '../utils/queries';
import Header from './Header';

const BookClinic = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Relief Clinic',
    address: 'HSR Layout',
    city:'Bangalore'
  });

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

      if (!bookedSlots.includes(tempTime)) {
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

  const goToPaymentSummary = () => {
    if (selectedSlot) {
      dispatch(setTime(selectedSlot));
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
