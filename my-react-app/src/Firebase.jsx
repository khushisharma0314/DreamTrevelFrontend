import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCJY3AEkmaaiK-7U0l_ORvrO7JjciXVpn4",
    authDomain: "farenexa-d0720.firebaseapp.com",
    projectId: "farenexa-d0720",
    storageBucket: "farenexa-d0720.firebasestorage.app",
    messagingSenderId: "187879238609",
    appId: "1:187879238609:web:d9c3b3d81690e750a9cef0",
    measurementId: "G-H3M6CSJ2F2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);