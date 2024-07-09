import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const SearchItem = ({ speciality }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const spec = speciality.split(" ").join('-');
    navigate(`/search/${spec}`);
  };

  return (
    <div className='flex flex-row justify-between bg-white border p-3 border-gray-300 border-b-1 border-t-0 border-r-1 border-l-1' onClick={handleClick}>
      <div className='flex flex-row items-center justify-center'>
        <IoIosSearch />
        <h1 className='ml-3'>{speciality}</h1>
      </div>
      <h1 className='mr-4 font-thin text-xs pt-1'>SPECIALITY</h1>
    </div>
  );
};
const SearchDoctorItem = ({d_id,name, image }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/doctor/${d_id}`);
  };

  return (
    <div className='flex flex-row justify-between bg-white border p-3 border-gray-300 border-b-1 border-t-0 border-r-1 border-l-1' onClick={handleClick}>
      <div className='flex flex-row items-center justify-center'>
        <img className='w-6 rounded-full' src={image}/>
        <h1 className='ml-3'>{name}</h1>
      </div>
      <h1 className='mr-4 font-thin text-xs pt-1'>DOCTOR</h1>
    </div>
  );
};


const SearchCard = ({ popular, speciality, doctors }) => {
  const isDoctorList=doctors!==null && doctors.length>0;
  const isSpecList=speciality.length>0 || popular;

  return (
    <ul className="absolute">    
        {isSpecList && <li className='w-96 p-1 border text-gray-500 bg-gray-200'>{popular ? `Popular Searches` : 'Specialities'}</li> }
        {Array.isArray(speciality) && speciality.map((s, index) => (
            <li className=' w-96 text-gray-500 hover:cursor-pointer '><SearchItem speciality={s} /></li>
          ))
        }
        {isDoctorList && <li className='w-96 p-1 bg-gray-200 border border-gray-300 text-gray-500 border-b-1 border-t-0 border-r-1 border-l-1'>{'Doctors'}</li>} 
        {
          isDoctorList && doctors.map((item) => (
            <li className=' w-96 text-gray-500 hover:cursor-pointer '><SearchDoctorItem d_id={item.id} name={item.name} image={item.image_url} /></li>
          ))
        }
      
    </ul>

  );
};

export default SearchCard;