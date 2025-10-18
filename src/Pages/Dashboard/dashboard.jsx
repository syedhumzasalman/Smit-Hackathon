import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import PitchCard from "../../component/pitchCard/PitchCard";
import { db } from "../../FireBase/firebase";
import Navbar from "../../component/Navbar/Navbar";
import Swal from "sweetalert2";
import { generateAIPitch } from "../../component/generateAIPitch/generateAIPitch";

const Dashboard = () => {
  const [pitches, setPitches] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [lastAIResponse, setLastAIResponse] = useState(null);
  const uid = localStorage.getItem("uid");



  const handleSearch = async (e) => {
    e.preventDefault();
    if (!userInput) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      })
    }


    const aiOutput = await generateAIPitch(userInput);

    //  Save to Firestore
    const userPitchesCol = collection(db, "users", uid, "pitches");
    const newPitchDoc = doc(userPitchesCol);

    await setDoc(newPitchDoc, {
      userInput,
      name: aiOutput.name || "",
      tagline: aiOutput.tagline || "",
      pitch: aiOutput.pitch || "",
      audience: aiOutput.audience || "",
      landingPage: aiOutput.landingPage || "",
      createdAt: serverTimestamp()
    });


    setLastAIResponse(aiOutput);
    setUserInput("");
  };


  const renderAIResponse = (ai) => {
    if (!ai) return null;
    const cleanName = ai.name ? ai.name.trim() : "startup";

    return (
      <div className="bg-gray-100 p-4 rounded mb-4 space-y-2">
        <div><strong>Name:</strong> {ai.name}</div>
        <div><strong>Tagline:</strong> {ai.tagline}</div>
        <div><strong>Pitch:</strong> {ai.pitch}</div>
        <div><strong>Audience:</strong> {ai.audience}</div>
      </div>
    );
  };


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6">Your AI Pitches</h1>

        <form onSubmit={handleSearch} className="mb-6 p-4 bg-white shadow rounded space-y-4">
          <textarea
            placeholder="Enter your startup idea or message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Send to AI
          </button>
        </form>

        {renderAIResponse(lastAIResponse)}

      
      </div>
    </>
  );
};

export default Dashboard;
