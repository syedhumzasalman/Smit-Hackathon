import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../FireBase/firebase";
import Swal from "sweetalert2";

const ShowHistory = ({ onHistoryClick, refreshTrigger }) => {
    const uid = localStorage.getItem('uid');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyRef = collection(db, "users", uid, "History");

                const q = query(historyRef, orderBy("timestamp", "desc"));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setHistory(data);
            } catch (error) {
                console.log("Error fetching history:", error.message);
            } finally {
                setLoading(false);
            }
        };

        if (uid) fetchHistory();
    }, [uid, refreshTrigger]);

    const handleClick = (item) => {
        if (onHistoryClick) {
            onHistoryClick({
                question: item.question,
                answer: item.answer
            });
        }
    };


    const handleDelete = async (e, itemId) => {
        e.stopPropagation(); // Parent click se bachne ke liye

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteDoc(doc(db, "users", uid, "History", itemId));

                setHistory(history.filter(item => item.id !== itemId));

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'History deleted successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error("Error deleting:", error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete.',
                });
            }
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-center font-semibold mb-4 text-lg">Your History</h2>

            {loading ? (
                <p className="text-center text-zinc-400 text-sm">Loading...</p>
            ) : history.length > 0 ? (
                <ul className="space-y-2">
                    {history.map((item, index) => (
                        <li
                            key={item.id}
                            onClick={() => handleClick(item)}
                            className="p-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 cursor-pointer transition-all border border-zinc-600 hover:border-blue-500 relative group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate text-zinc-200">
                                        <span className="text-blue-400 font-semibold">{index + 1}.</span> {item.answer.name}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1">
                                        {item.createdAt?.toDate().toLocaleDateString() || "No date"}
                                    </p>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="ml-2 p-1.5 hover:bg-red-600 rounded bg-zinc-800 md:bg-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4 text-red-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-zinc-400 text-sm">No history found.</p>
            )}
        </div>
    );
};

export default ShowHistory;