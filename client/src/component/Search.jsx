import React, { useState, useEffect } from 'react';
import SearchCard from './SearchCard';
import { SEARCH_SPECIALITY } from '../utils/queries';
import { client } from '..';

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [showPopular, setShowPopular] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const pspeciality = ["Dentist", "General Physician", "Dermatologist", "Homoeopath", "Ayurveda"];

  useEffect(() => {
    if (keyword !== "") {
      client
        .query({ query:SEARCH_SPECIALITY, variables: { name: keyword } })
        .then(result => {
          if (result.data?.specialities) {
            setSearchResults(result.data.specialities);
          }
        })
        .catch(error => console.error('Error fetching doctors:', error));
    }
  }, [keyword]);

  const handleClick = () => {
    if (keyword === "") {
      setShowPopular(true);
    }
  };

  const handleChange = (event) => {
    setKeyword(event.target.value);
    setShowPopular(false);
  };

  return (
    <div className="relative">
      <img className="w-full h-auto object-cover" src="https://blog.practo.com/wp-content/uploads/2017/04/Blog-Hero-Visual-1170x460.png" alt="practo-banner" />
      <div className="absolute inset-0 flex items-center justify-center flex-col overflow-visible">
        <input
          onClick={handleClick}
          onChange={handleChange}
          type="text"
          placeholder="Search doctors"
          className="p-2 hover:cursor-pointer w-1/4"
        />
        <div className='flex flex-row justify-center '>
          <div></div>
          {searchResults?.map((item)=>{
            <h1>item</h1>
          })}
            <div className="absolute top-full w-1/4 ml-96  transform -translate-x-1/2 mt-2"> 
            {showPopular
              ? <SearchCard popular={true} speciality={pspeciality} />
              : (
                keyword!=="" && <SearchCard popular={false} speciality={searchResults?.map(item => item.name)} />
              )} 
          </div>
          <div></div>
        </div>
        
      </div>
    </div>
  );
};

export default Search;
