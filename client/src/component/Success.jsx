import React from 'react'
import {useNavigate} from 'react-router-dom'

const Success = () => {
  const navigate=useNavigate();

  return (
    <div>
      Success
      {setTimeout(()=>{
        navigate('/appointment/status');
      },3000)}
    </div>
  )
}

export default Success