import React, { useState, useRef, useEffect } from 'react';
import SearchCard from './SearchCard';
import { SEARCH_SPECIALITY,GET_DOCTOR_NAME } from '../utils/queries';
import { client } from '..';

const Search = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [showPopular, setShowPopular] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchDoctors,setSearchDoctors]=useState([]);
  const pspeciality = ["Dentist", "General Physician", "Dermatologist", "Homoeopath", "Ayurveda"];

  useEffect(() => {
    if (keyword.length>1) {
      client
        .query({ query: SEARCH_SPECIALITY, variables: { name: keyword } })
        .then(result => {
          if (result.data?.specialities) {
            setSearchResults(result.data.specialities);
          }
        })
        .catch(error => console.error('Error fetching doctors:', error));
      client
        .query({ query: GET_DOCTOR_NAME, variables: { name: keyword } })
        .then(result => {
          if (result.data?.doctorByName) {
            setSearchDoctors(result.data.doctorByName);
          }
        })
        .catch(error => console.error('Error fetching doctors:', error));
    }
  }, [keyword]);

  const handleClick = () => {
    if (keyword === "") {
      setIsContentVisible(true);
      setShowPopular(true);
    }
  };

  const handleClickOutside = (event) => {
    if (
      inputRef.current && !inputRef.current.contains(event.target) &&
      contentRef.current && !contentRef.current.contains(event.target)
    ) {
      setIsContentVisible(false);
    }
  };

  const handleChange = (event) => {
    setKeyword(event.target.value);
    setShowPopular(false);
    setIsContentVisible(true);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-row justify-center items-center py-10">
      <div className='relative'>
        <input
          ref={inputRef}
          onClick={handleClick}
          onChange={handleChange}
          type="text"
          placeholder="Search Doctors"
          className="p-2 hover:cursor-pointer w-96 border border-gray-300 shadow-sm text-gray-800"
        />

        {isContentVisible && (
          <div ref={contentRef} className="absolute top-full left-0 mt-2 p-2 border border-gray-300 bg-white shadow-lg">
            {showPopular ? (
              <SearchCard popular={true} speciality={pspeciality} doctors={null} />
            ) : (
              keyword.length>1 && <SearchCard popular={false} speciality={searchResults.map((item)=>item.name)} doctors={searchDoctors}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
