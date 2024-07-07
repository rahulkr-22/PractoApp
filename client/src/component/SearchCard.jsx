import React from 'react';
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const SearchItem = ({speciality}) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
        const spec=speciality.split(" ").join('-');
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


const SearchCard = ({ popular, speciality }) => {
  return (
    <div className='flex flex-col hover:cursor-pointer rounded shadow-md'>
      <div className='bg-gray-100 font- text-xs border border-gray-300 p-2'>
       
        {popular ? `Popular Searches` : 'Specialities'}
      </div>
      {Array.isArray(speciality) && speciality.map((s, index) => (
        <SearchItem speciality={s} />
      ))}
    </div>
  );
};

export default SearchCard;