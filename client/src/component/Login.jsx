import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast'
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../utils/queries';
import { setUser } from '../redux/userSlice';


const Login = () => {
  const [userId,setUserId]=useState(null)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Mutation
  const [login,{}]=useMutation(LOGIN_MUTATION);
  const [register,{}]=useMutation(REGISTER_MUTATION);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
        const {data}= await login({variables:{email,password}});
        //dispatch
        dispatch(setUser(data?.loginUser))
        localStorage.setItem('user',JSON.stringify(data?.loginUser));
        toast.success("Login successsfully.")
        navigate("/")
    } catch (error) {
        console.log('Error logging in: ',error.message);
        toast.error(error.message);
    }
    setEmail("");
    setPassword("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
        const {data}=await register({variables:{name,email,contact,password}});
        dispatch(setUser(data?.registerUser));
        localStorage.setItem('user',JSON.stringify(data?.registerUser));
        toast.success("Registered successsfully.")
        navigate('/');
    } catch (error) {
        console.log(error)
        toast.error(error.message);
    }
    setContact("");
    setEmail("");
    setName("");
    setPassword("");

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
        {!isLogin ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Join Practo</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Mobile Number</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Mobile Number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </button>
            </form>
            <p className="text-center mt-4">
              Already have an account?{' '}
              <button
                className="text-sky-500"
                onClick={() => setIsLogin(true)}
              >
                Login Here
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Login to Practo</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </button>
            </form>
            <p className="text-center mt-4">
              Don't have an account?{' '}
              <button
                className="text-sky-500"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
