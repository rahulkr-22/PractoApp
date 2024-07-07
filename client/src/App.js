
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Home from './component/Home';
import Login from './component/Login';
import DoctorList from './component/DoctorList';
import Header from './component/Header';
import DoctorProfile from './component/DoctorProfile';
import BookSlot from './component/BookSlot';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/search/:speciality' element={<DoctorList/>}/>
      <Route path='/doctor/:id' element={<DoctorProfile/>}/>
      <Route path='/appointment/:id' element={<BookSlot/>}/>
    </Routes>
  );
}

export default App;
