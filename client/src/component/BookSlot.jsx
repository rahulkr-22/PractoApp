import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { setTime } from '../redux/appointmentSlice';


const BookClinic = () => {
  const {id}=useParams();
  const dispatch=useDispatch();
  const navigate = useNavigate(); 
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Relief Clinic',
    fee: 300,
    location: 'HSR Layout',
  });

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
      slots.push({ time: time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }), available: true });
    }
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const goToPaymentSummary = () => {
    if (selectedSlot) {
      dispatch(setTime(selectedSlot.time))
      navigate(`/payment-summary/${id}`); 
    } else {
      alert('Please select a time slot first.');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-100 text-black-800">
          <h2 className="text-lg font-bold text-center">Clinic Appointment</h2>
          <div className="mt-2">
            <h3 className="text-lg font-semibold text-gray-800">{clinicInfo.name}</h3>
            <p className="text-sm">{clinicInfo.location}</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Pick a time slot</h3>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                className={`cursor-pointer py-2 px-4 rounded ${slot.available ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-400'} 
                ${selectedSlot && selectedSlot.time === slot.time ? 'border border-blue-500' : ''}`}
                disabled={!slot.available}
                onClick={() => handleSlotSelect(slot)}
              >
                {slot.time}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={goToPaymentSummary}
              className="cursor-pointer py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={!selectedSlot}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookClinic;
