import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';


function App() {
  return (

      <Router>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </Router>

  )
}

export default App
