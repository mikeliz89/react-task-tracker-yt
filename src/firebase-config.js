// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, updateProfile } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

//App check for production
if (process.env.NODE_ENV === 'production') {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.REACT_APP_FIREBASE_SITE_KEY),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
  });
}

//Storage functions
export async function uploadProfilePic(file, currentUser, setLoading) {
  const fileRef = ref(storage, "avatars/" + currentUser.uid + '.png');

  setLoading(true);
  let snapshot = await uploadBytes(fileRef, file);

  const _photoURL = await getDownloadURL(fileRef)

  updateProfile(currentUser, { photoURL: _photoURL });
  setLoading(false);

  console.log("file uploaded");

  return true;
}

//const analytics = getAnalytics(app);