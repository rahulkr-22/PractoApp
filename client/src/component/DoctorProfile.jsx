import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { client } from '..';
import { DOCTOR_SPECIALITY, GET_CLINIC, GET_DOCTOR, GET_REVIEW } from '../utils/queries';
import { IoStarOutline } from "react-icons/io5";
import Header from './Header';
import { FaStar } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";

const Star = ({ count }) => {
  const stars = Array(count).fill(null);
  return (
    <div className="flex flex-row text-green-500 gap-1">
      {stars.map((_, index) => (
        <FaStar />
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
  const [clinic, setClinic] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInfo, setIsInfo] = useState(true);
  const [showProperty1, setShowProperty1] = useState('w-1/2 p-3 font-semibold  bg-white hover:cursor-pointer text-center')
  const [showProperty2, setShowProperty2] = useState('w-1/2 p-3 font-semibold  bg-blue-50 hover:cursor-pointer text-center')
  const speciality = localStorage.getItem('speciality');
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
        variables: { d_id: doctorId, speciality },
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
  const handleInfo = () => {
    setIsInfo(true);
    setShowProperty1('w-1/2 p-3 font-semibold bg-white hover:cursor-pointer text-center')
    setShowProperty2('w-1/2 p-3 font-semibold  bg-blue-50 hover:cursor-pointer text-center')
  }
  const handleReviews = () => {
    setIsInfo(false)

    setShowProperty2('w-1/2 p-3 font-semibold  bg-white hover:cursor-pointer text-center')
    setShowProperty1('w-1/2 p-3 font-semibold  bg-blue-50 hover:cursor-pointer text-center')
  }

  // console.log(reviews)
  return (
    <div>
      <Header />
      <div className='flex flex-col justify-center items-center'>
        <div className="container w-[50%] mx-auto mt-8">
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
                <div className='flex flex-col justify-center items-center my-4'>
                  <p className='flex flex-row items-center gap-2 my-2'>{<MdVerified className='text-green-500' />} <span>Medical Registration Verified</span></p>
                  <p className='flex flex-row items-center gap-2 text-green-500'>{<BiSolidLike />} 96% <span>(164 patients)</span></p>
                </div>
              </div>
              <div className="mb-6 text-center">
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

        <div className="flex flex-row  w-[50%] bg-white border-t-8 shadow-md rounded-sm">
          <div onClick={handleInfo} className={showProperty1}>Info</div>
          <div onClick={handleReviews} className={showProperty2}>Reviews</div>
        </div>
        {isInfo === true ?
          (<div className="flex flex-row w-[50%] shadow-md rounded-sm bg-white">

            <div className='flex justify-normal w-[40%] bg-white ml-8'>
              <ul className='divide-y-2 divide-sky-100 p-2'>
                {(clinic && clinic.map((cl) => {
                  return (
                    <li className='mt-4'>
                      <div className='flex flex-row gap-4'> <p className='font-semibold text-sky-500'>{cl.name},</p> <p className='text-gray-500 font-semibold'>{cl.city}</p></div>

                      <p className='text-md text-gray-400 mb-2'>{cl.address}</p>

                      <span className='flex flex-row items-center gap-2 text-green-500 font-semibold'>5.0 <Star count={5} /></span>

                    </li>)
                }))}
              </ul>
            </div>
            <div className='mt-10 text-gray-700'>
              <p className='font-semibold'>Mon-Sun</p>
              <p>09:00 AM - 10:00PM</p>
            </div>
            <div className='mt-10 ml-16 text-gray-600 font-semibold flex flex-col gap-5'>
              <p>₹{doctor.fee}</p>
              <p>Online Payment Available</p>
              <div className='text-purple-600 '>
                <p className='flex flex-row items-center gap-1'>Prime <span>{<MdVerified />}</span></p>
                <p>Max. 15 mins wait + Verified details</p>
              </div>
            </div>
          </div>)
          : (<div className="flex justify-center w-[50%] shadow-md rounded-sm bg-white p-10">
            <ul className='divide-y-2 '>
              {reviews.length===0?<p>No Reviews Yet</p>:<p>{reviews.length} Reviews</p>}
              {(reviews && reviews.map((review) => {
                return (
                  <li className='p-2 my-2'>
                    <p className='flex flex-row gap-3 my-4 font-medium items-center'><img className='w-8 rounded-full' src='https://preview.keenthemes.com/metronic-v4/theme_rtl/assets/pages/media/profile/profile_user.jpg'/>{review.patientName} <Star count={review.rating} /> </p>
                    <p className='font-semibold text-gray-600 mb-2'>{review.visitReason}</p>
                    <p className='text-gray-600 text-sm'>{review.content}</p>
                  </li>)
              }))}
            </ul>
          </div>)}
      </div>
    </div>
  );
};

export default DoctorProfile;
