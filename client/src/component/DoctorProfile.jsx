import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { client } from '..';
import { DOCTOR_SPECIALITY, GET_CLINIC, GET_DOCTOR, GET_REVIEW } from '../utils/queries';
import { IoStarOutline } from "react-icons/io5";
import Header from './Header';

const Star = ({ count }) => {
  const stars = Array(count).fill(null);
  return (
    <div className="flex flex-row text-yellow-500">
      {stars.map((_, index) => (
        <IoStarOutline/>
      ))}
    </div>
  );
};

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [clinic,setClinic]=useState(null);
  const [reviews,setReviews]=useState(null);
  const [loading, setLoading] = useState(true);
  const [isInfo,setIsInfo]=useState(true);
  const [showProperty1,setShowProperty1]=useState('w-1/2 p-3 bg-white hover:cursor-pointer')
  const [showProperty2,setShowProperty2]=useState('w-1/2 p-3 bg-blue-50 hover:cursor-pointer')
  const speciality=localStorage.getItem('speciality');
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

      client.query({
        query: GET_CLINIC,
        variables: { d_id: doctorId },
      })
        .then(result => {
          if (result.data && result.data.doctorClinic) {
            setClinic(result.data.doctorClinic.map(clinic => clinic));
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching clinic details:', error);
          setLoading(false);
        });

      client.query({
        query: GET_REVIEW,
        variables: { d_id: doctorId,speciality },
      })
        .then(result => {
          if (result.data && result.data.doctorReview) {
            setReviews(result.data.doctorReview.map(review => review));
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching reviews:', error);
          setLoading(false);
        });

    } 
    else {
      setLoading(false);
    }
  }, [id]);

  const handleBookClinicVisit = () => {
    navigate(`/appointment/${id}`);
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }
  const handleInfo=()=>{
    setIsInfo(true);
    setShowProperty1('w-1/2 p-3 bg-white hover:cursor-pointer')
    setShowProperty2('w-1/2 p-3 bg-blue-50 hover:cursor-pointer')
  }
  const handleReviews=()=>{
    setIsInfo(false)
    
    setShowProperty2('w-1/2 p-3 bg-white hover:cursor-pointer')
    setShowProperty1('w-1/2 p-3 bg-blue-50 hover:cursor-pointer')
  }

  // console.log(reviews)
  return (
    <div>
      <Header />
      <div className='flex flex-col justify-center items-center'>
      <div className="container w-[30%] mx-auto mt-8">
        {doctor ? (
          <div className=" mx-auto bg-white shadow-md rounded-sm overflow-hidden">
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

      <div className="flex flex-row  w-[30%] bg-white border-t-8 shadow-md rounded-sm">
        <div onClick={handleInfo} className={showProperty1}>Info</div>
        <div onClick={handleReviews} className={showProperty2}>Reviews</div>
      </div>
      {isInfo===true?
      (<div className="flex justify-center w-[30%] shadow-md rounded-sm bg-white p-10">
            <div>fgdfh</div>
            <div>wetg</div>
            <div></div>
        </div>)
      :( <div className="flex justify-center w-[30%] shadow-md rounded-sm bg-white p-10">
            <ul className='divide-y-2 '>
              {(reviews && reviews.map((review)=>{
                return (
                <li className='p-2 my-2'>
                  {console.log(review)}
                  <p className='flex flex-row items-center gap-3 my-4'>{review.patientName} <Star count={review.rating}/> </p>
                  <p className='font-semibold text-gray-600 mb-2'>{review.visitReason}</p>
                  <p className='font-gray-400 '>{review.content}</p>
                  </li>)
              }))}
            </ul>
        </div>)}
        </div>
    </div>
  );
};

export default DoctorProfile;
