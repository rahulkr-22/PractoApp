import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { client } from '..';
import { GET_DOCTOR } from '../utils/queries';
{/* <button
  className="rounded p-1 px-2 text-sky-400 font-medium hover:bg-sky-500 hover:text-white"
  onClick={handleClickHome}
>
  Back To Home
</button> */}


const DoctorProfile = () => {
  const dispatch=useDispatch();
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    client.query({
      query: GET_DOCTOR,
      variables: { id: parseInt(id) },
    })
      .then(result => {
        if (result.data && result.data.doctor) {
          setDoctor(result.data.doctor);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching doctor:', error);
        setLoading(false);
      });
  }, [id]);

  const handleBookClinicVisit = () => {   
    navigate(`/appointment/${id}`); 
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      {doctor ? (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4">
            <img
              className="w-32 h-32 object-cover shadow-lg rounded-full mx-auto"
              src={doctor.image_url}
              alt="Doctor"
            />
            <h1 className="text-2xl font-bold text-center mt-4">{doctor.name}</h1>
            {/* <p className="text-gray-600 text-sm text-center">{doctor.specialisations.map(spec => spec.name).join(', ')}</p> */}
            <p className="text-gray-600 text-center mt-2">{doctor.experience} years experience</p>
            <p className="text-gray-600 text-center mt-2">₹{doctor.fee} Consultation fee</p>
          </div>
          <div className="p-4 text-center">
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
              onClick={handleBookClinicVisit} 
            >
              Book Clinic Visit
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center mt-8">Doctor not found</p>
      )}
    </div>
  );
};

export default DoctorProfile;
