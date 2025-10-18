import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AuthRoutes from './component/Routing/authRoutes'
import Signup from './Pages/SignupPage/signup'
import Login from './Pages/LoginPage/login'
import Dashboard from './Pages/Dashboard/dashboard'
import PrivateRoutes from './component/Routing/privateRoutes'
import NotFound from './Pages/NotFound/NotFound'
import Searches from './Pages/searches/Searches'

function App() {


  return (
    <>
      <Routes>

        <Route element={<AuthRoutes />}>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>


        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/searches" element={<Searches />} />
        </Route>

          <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
