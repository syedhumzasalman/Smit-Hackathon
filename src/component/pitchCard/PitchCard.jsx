import React from 'react'


const PitchCard = ({ pitch }) => {
    return (
        <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-indigo-600">{pitch.name}</h2>
            <p className="text-gray-600">{pitch.tagline}</p>
            <p className="text-sm text-gray-400 mt-2">{pitch.date}</p>
            <button className="mt-3 bg-indigo-500 text-white px-4 py-1 rounded-lg hover:bg-indigo-600">
                View
            </button>
        </div>
    );
};


export default PitchCard