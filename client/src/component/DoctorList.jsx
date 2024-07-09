import React, { useEffect, useState } from 'react';
import DoctorCard from './DoctorCard.jsx';
import { client } from '../index.js';
import { SEARCH_DOCTORS } from '../utils/queries.js';
import Loading from './Loading.jsx';
import { useParams } from 'react-router-dom';
import Header from './Header.jsx';
import Search from './Search.jsx';


const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
    const {speciality}=useParams();
    
  useEffect(() => {

    setLoading(true);
    
    client.query({
        query:SEARCH_DOCTORS,
        variables: {
        name: speciality ,
        limit: 10, 
        offset: (page - 1) * 10, 
        },
    })
    .then((result)=>{
        if (result.data && result.data.DoctorFromSpeciality.length > 0) {
            setDoctors((prevDoctors) => [...prevDoctors, ...result.data.DoctorFromSpeciality]);
            } else {
            setHasMore(false); 
            }
    })
    .catch((error)=>{
        console.log(error)
    })

    setLoading(false)

  }, [page]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      <Header/>

      <div className='flex justify-center font-semibold text-lg text-gray-700 mb-3 mt-4'>
        Showing Results for {speciality}s.
      </div>

      <div className='flex flex-col justify-center'>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctorObj={doctor} speciality={speciality} />
      ))}
      {loading && <Loading />}
    </div>
    </div>
    

  );
};

export default DoctorList;
