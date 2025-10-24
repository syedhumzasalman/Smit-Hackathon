import { collection, addDoc } from "firebase/firestore";
import { db } from "../../FireBase/firebase.js";

const HandelHistory = async ({ question, answer }) => {
    const uid = localStorage.getItem('uid');

    try {
        const userHistoryRef = collection(db, "users", uid, "History");

        
        await addDoc(userHistoryRef, {
            question: question,  
            answer: {
                name: answer.name,
                tagline: answer.tagline,
                pitch: answer.pitch,
                audience: answer.audience,
                landingPage: answer.landingPage  
            },
            createdAt: new Date(),
            timestamp: Date.now()  
        });

        console.log("✅ History saved successfully!");
        return true;
    } catch (error) {
        console.error("❌ Error saving history:", error.message);
        return false;
    }
};

export default HandelHistory;