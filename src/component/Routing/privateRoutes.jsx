import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {

    // console.log(!!localStorage.getItem("uid"));
    

  return (
    localStorage.getItem("uid") ? <Outlet/> : <Navigate to={"/"} />
  )
}

export default PrivateRoutes