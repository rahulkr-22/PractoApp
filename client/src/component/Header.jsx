import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate=useNavigate();
  const {user}=useSelector((state)=>state.user);

  return (
    <div className='px-44 py-5 flex items-center justify-between border-b-2'>
      <img className='w-32' src='https://upload.wikimedia.org/wikipedia/en/6/64/Practo_new_logo.png?20180609150803' alt='practo-logo'/>
      {user?<div><h3>{user.name}</h3><button onClick={()=>{localStorage.removeItem('user')}}>Logout</button></div> :<button onClick={()=>{navigate('/login')}} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Login/Signup</button>}
    </div>
  )
}

export default Header