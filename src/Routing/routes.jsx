import React, { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from '../Pages/SignupPage/signup'
import Login from '../Pages/LoginPage/login'
import Dashboard from '../Pages/Dashboard/dashboard'

const Routing = () => {

    const [user, setUser] = useState(false)

    return (
        <BrowserRouter>
            <Routes>

                <Route>
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
                    <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                </Route>


                <Route>
                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default Routing