
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Home from './component/Home';
import Login from './component/Login';
import DoctorList from './component/DoctorList';
import DoctorProfile from './component/DoctorProfile';
import BookSlot from './component/BookSlot';
import PaymentSummary from './component/PaymentSummary';
import Success from './component/Success';
import Failed from './component/Failed';
import Payment from './component/Payment';
import AppointmentConfirmation from './component/AppointmentConfirmation';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/search/:speciality' element={<DoctorList/>}/>
      <Route path='/doctor/:id' element={<DoctorProfile/>}/>
      <Route path='/appointment/:id' element={<BookSlot/>}/>
      <Route path='/payment-summary/:id' element={<PaymentSummary/>}/>
      <Route path='/payment' element={<Payment/>}/>
      <Route path='/payment/success' element={<Success/>}/>
      <Route path='/payment/failed' element={<Failed/>}/>
      <Route path='/appointment/status' element={<AppointmentConfirmation/>}/>
    </Routes>
  );
}

export default App;
