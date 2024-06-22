// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyC-qgDyFiy5QjqyuRloqz9-mQ4siujKLMo',
    authDomain: 'couffer-c4625.firebaseapp.com',
    projectId: 'couffer-c4625',
    storageBucket: 'couffer-c4625.appspot.com',
    messagingSenderId: '420997596589',
    appId: '1:420997596589:web:68a5202c35da9bf5244d24',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
