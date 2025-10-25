import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../FireBase/firebase.js";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'


const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'User',
    email: 'user@example.com'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = localStorage.getItem('uid');

      if (uid) {
        try {
          const userDocRef = doc(db, "users", uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              name: data.name || data.username || 'User',
              email: data.email || 'user@example.com'
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to logout?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('uid');

        Swal.fire({
          icon: 'success',
          title: 'Logged out!',
          text: 'See you soon!',
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/login")

      }
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 p-2 pr-3 rounded-full border border-zinc-600 transition"
        >
          {/* Profile Icon */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
            {userData.name.charAt(0).toUpperCase()}
          </div>

          {/* Username - Hidden on mobile */}
          <span className="hidden sm:block text-sm font-medium text-white">
            {userData.name}
          </span>

          {/* Dropdown Arrow */}
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <>
            {/* Overlay to close dropdown */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />

            {/* Dropdown Content */}
            <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-zinc-700">
                <p className="text-sm font-semibold text-white truncate">
                  {userData.name}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {userData.email}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-white hover:bg-red-600 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;