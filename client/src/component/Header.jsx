import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Header = () => {
  const navigate=useNavigate();
  const {user}=useSelector((state)=>state.user);

  const logoutHandler=()=>{
    localStorage.removeItem('user');
    toast.success('Logged out!')
    window.location.reload();
  }

  return (
    <div className='px-44 py-5 flex items-center justify-between border-b-2 bg-white'>
      <img onClick={()=>{navigate('/')}} className='w-32 hover:cursor-pointer' src='https://upload.wikimedia.org/wikipedia/en/6/64/Practo_new_logo.png?20180609150803' alt='practo-logo'/>

      {user?
      <div className='flex flex-row gap-6 items-center'>
        <div className='font-semibold text-gray-500'>{user.name}</div>
      <button className="border-2 border-sky-300 rounded p-1 px-2 text-sky-400 font-medium hover:bg-sky-400 hover:text-white" onClick={logoutHandler}>Logout</button>
      </div> 
      :<button onClick={()=>{navigate('/login')}} className="border-2 border-sky-300 rounded p-1 px-2 text-sky-400 font-medium hover:bg-sky-400 hover:text-white">Login/Signup</button>}
    </div>
  )
}

export default Header