import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../FireBase/firebase';
import Navbar from '../../component/Navbar/Navbar';

const PitchCard = ({ pitch, onView }) => {
    return (
        <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
            <div>
                <h2 className="font-bold text-lg">{pitch.name}</h2>
                <p className="text-gray-600">{pitch.tagline}</p>
            </div>
            <button
                onClick={() => onView(pitch)}
                className="mt-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                View
            </button>
        </div>
    );
};

const Searches = () => {
    const [pitches, setPitches] = useState([]);
    const [selectedPitch, setSelectedPitch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const uid = localStorage.getItem('uid');

    useEffect(() => {
        const fetchPitches = async () => {
            if (!uid) return;
            try {
                const pitchesCol = collection(db, 'users', uid, 'pitches');
                const snapshot = await getDocs(pitchesCol);
                const pitchesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPitches(pitchesData);
            } catch (err) {
                console.error('Error fetching pitches:', err);
            }
        };

        fetchPitches();
    }, [uid]);

    const openModal = (pitch) => {
        setSelectedPitch(pitch);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPitch(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-2xl font-bold mb-6">All Pitches</h1>

                {pitches.length === 0 ? (
                    <p>No pitches found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pitches.map(pitch => (
                            <PitchCard key={pitch.id} pitch={pitch} onView={openModal} />
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && selectedPitch && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
                        <div className="bg-white rounded-lg p-6 max-w-lg w-full relative shadow-lg animate-fadeIn">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-2">{selectedPitch.name}</h2>
                            <p className="text-gray-600 mb-2"><strong>Tagline:</strong> {selectedPitch.tagline}</p>
                            <p className="mb-2"><strong>Pitch:</strong> {selectedPitch.pitch}</p>
                            <p className="mb-2"><strong>Audience:</strong> {selectedPitch.audience}</p>
                            {selectedPitch.createdAt && (
                                <p className="text-gray-500 text-sm mt-2">
                                    <strong>Created At:</strong>{" "}
                                    {selectedPitch.createdAt.toDate
                                        ? selectedPitch.createdAt.toDate().toLocaleString()
                                        : selectedPitch.createdAt.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal animation styles */}
            <style>
                {`
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
            </style>
        </>
    );
};

export default Searches;
