import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import SignUpApp from './components/Sign/up/SignUpApp'
import SignInApp from './components/Sign/in/SignInApp'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/Home'
import Navbar from './components/Navbar';
import ListApp from './components/list/ListApp'
import { AuthProvider } from './AuthContext'

function App() {
  return (
    <>
      <BrowserRouter>
        {/* Router 밖에는 절대 URL에 따라 
            바뀌지 않는 컴포넌트들만 둔다.
            ex) navbar
         */}
        <AuthProvider>
          <CssBaseline />
          <Navbar />

          <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/signup' element={<SignUpApp />} />
            <Route path='/signin' element={<SignInApp />} />
            <Route path='/list' element={<ListApp />} />
            {/* axios는 200번대 statusCode가 아니면 Promise를 reject(throw)한다. */}
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
