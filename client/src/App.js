
import './App.css';
import {Routes, Route} from 'react-router-dom'
import Home from './component/Home';
import Login from './component/Login';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
  );
}

export default App;
