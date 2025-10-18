import React, { useState } from 'react'
import InputField from '../../component/InputField/inputField'
import Swal from 'sweetalert2'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../../FireBase/firebase'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'


const Signup = () => {

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const navigate = useNavigate();



  const userObj = {
    userName,
    userEmail,
    userPassword,
  }

  const createUser = async () => {

    //  Validation for empty fields
    if (!userName || !userEmail || !userPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      })
    }

    // Email validation (any domain)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid Gmail address!",
      });
    }


    try {

      // Firebase auth requires email and password
      const response = await createUserWithEmailAndPassword(auth, userEmail, userPassword)
      const user = response.user;

      // console.log(user)

      // Update user profile display name
      await updateProfile(user, {
        displayName: userName
      });

      // Save user info in Firestore
      await setDoc(doc(collection(db, "users"), user.uid), {
        name: userName,
        email: userEmail,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: `Welcome, ${userName}!`,
        confirmButtonColor: "#22c55e"
      }).then(() => {
        setUserName("");
        setUserEmail("");
        setUserPassword("");
        navigate("/login")
      });




    } catch (error) {
      console.log(error.message);
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Something went wrong! Please try again.",
        confirmButtonColor: "#ef4444"
      }).then(() => {
        setUserName("");
        setUserEmail("");
        setUserPassword("");
      });
    }

  }


  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Create an Account
          </h1>

          <div className="flex flex-col space-y-4">

            <div className="flex flex-col space-y-5">

              <InputField
                type="text"
                text="Enter your Full Name"
                onChange={(e) => setUserName(e.target.value)}
                value={userName} />

              <InputField
                type="email"
                text="Enter your Email"
                onChange={(e) => setUserEmail(e.target.value)}
                value={userEmail} />

              <InputField
                type="password"
                text="Enter your Password"
                onChange={(e) => setUserPassword(e.target.value)}
                value={userPassword}
              />

            </div>

            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition duration-200"
              onClick={createUser}>
              Sign Up
            </button>

            <p>Already have an account
              <Link to="/login" className="text-indigo-600 hover:underline font-medium m-2">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

    </>
  )
}

export default Signup