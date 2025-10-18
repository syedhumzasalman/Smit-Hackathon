import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AuthRoutes = () => {
  return (
    !localStorage.getItem("uid") ? <Outlet/> : <Navigate to={"/dashboard"}/>
  )
}

export default AuthRoutes