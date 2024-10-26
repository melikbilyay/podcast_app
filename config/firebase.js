// firebase.js (or firebase.ts)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // Import Auth

const firebaseConfig = {
    apiKey: "AIzaSyCLd7X72OpxeX8AQyfbgC8d25sIHws0s8k",
    authDomain: "podcastapp-2e521.firebaseapp.com",
    projectId: "podcastapp-2e521",
    storageBucket: "podcastapp-2e521.appspot.com",
    messagingSenderId: "444891502936",
    appId: "1:444891502936:web:9168e3f8459eca4dfeed2d",
    measurementId: "G-1G8JFE2240"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Storage, and Auth
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage
const auth = getAuth(app); // Initialize Auth

// Export the initialized services
export { db, storage, auth };
