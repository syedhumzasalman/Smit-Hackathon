import React, { useState } from 'react'
import InputField from '../../component/InputField/inputField'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../FireBase/firebase'
import Swal from 'sweetalert2'

const Login = ({ setUser }) => {

  const [userEmailLogin, setUserEmailLogin] = useState("")
  const [userPasswordLogin, setUserPasswordLogin] = useState("")
  const navigate = useNavigate();

  const loginUser = async () => {


    //  Validation for empty fields
    if (!userEmailLogin || !userPasswordLogin) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      })
    }

    // Email validation (any domain)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmailLogin)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid Gmail address!",
      });
    }

    try {

      const userFound = await signInWithEmailAndPassword(auth, userEmailLogin, userPasswordLogin)
      const userName = userFound.user.name

      Swal.fire({
        icon: "success",
        title: "Logged In successfully",
        text: `Welcome! ${userName}`,
        confirmButtonColor: "#22c55e"
      }).then(() => {
        setUserEmailLogin("")
        setUserPasswordLogin("")
        localStorage.setItem("uid", userFound.user.uid);
        navigate("/dashboard")
      });

    } catch (error) {
      console.log(error.message);
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Something went wrong! Please try again.",
        confirmButtonColor: "#ef4444"
      }).then(() => {
        setUserEmailLogin("")
        setUserPasswordLogin("")
      });
    }


  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          LogIn
        </h1>

        <div className="flex flex-col space-y-4">

          <div className="flex flex-col space-y-5">

            <InputField
              type="email"
              text="Enter your Email"
              onChange={(e) => setUserEmailLogin(e.target.value)}
              value={userEmailLogin} />

            <InputField
              type="password"
              text="Enter your Password"
              onChange={(e) => setUserPasswordLogin(e.target.value)}
              value={userPasswordLogin}
            />

          </div>

          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition duration-200"
            onClick={loginUser}
          >
            Login
          </button>

          <p> Didn't Have an Account
            <Link to="/" className="text-indigo-600 hover:underline font-medium m-2">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login