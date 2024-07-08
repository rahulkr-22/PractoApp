import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { client } from '..';
import { DOCTOR_SPECIALITY, GET_DOCTOR } from '../utils/queries';
import Header from './Header';

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const doctorId = parseInt(id);

      client.query({
        query: GET_DOCTOR,
        variables: { id: doctorId },
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

      client.query({
        query: DOCTOR_SPECIALITY,
        variables: { d_id: doctorId },
      })
        .then(result => {
          if (result.data && result.data.doctorSpeciality) {
            setSpecialities(result.data.doctorSpeciality.map(spec => spec.name));
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching doctor speciality:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleBookClinicVisit = () => {
    navigate(`/appointment/${id}`);
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto mt-8">
        {doctor ? (
          <div className="max-w-lg mx-auto bg-white shadow-md rounded-sm overflow-hidden">
            <div className="p-4">
              <img
                className="w-32 h-32 object-cover shadow-lg rounded-full mx-auto"
                src={doctor.image_url}
                alt="Doctor"
              />
              <h1 className="text-2xl font-bold text-center mt-4 text-gray-700">{doctor.name}</h1>
              <p className="text-gray-600 text-center mt-2">
                <span className='text-gray-700'>Specialities:</span> {specialities.join(', ')}
              </p>
              <p className="text-gray-600 text-center mt-2"><span className='font-semibold'>{doctor.experience}</span> years experience</p>
              <p className="text-gray-600 text-center mt-2"> <span className='font-semibold'>₹{doctor.fee}</span> Consultation fee</p>

            </div>
            <div className="p-4 text-center">
              <button
                className="mt-6 bg-sky-500 text-white font-semibold px-3 py-2 rounded hover:bg-sky-700"
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
    </div>
  );
};

export default DoctorProfile;
