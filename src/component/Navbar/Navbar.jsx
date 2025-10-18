import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ uid }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (localStorage or context)
    localStorage.removeItem("uid");
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* Left: Logo / Brand */}
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
        PitchCraft
      </div>

      {/* Center: Optional links */}
      <div className="space-x-4">
        <button
          className="hover:bg-blue-500 px-3 py-1 rounded"
          onClick={() => navigate("/searches")}
        >
          See All Searches
        </button>
      </div>

      {/* Right: User / Logout */}
      <div className="flex items-center space-x-4">
        {uid && <span>Welcome, User</span>}
        <button
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
