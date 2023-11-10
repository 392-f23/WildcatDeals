import { initializeApp } from "firebase/app";
import { useEffect, useState, useCallback } from "react";
import { getDatabase, onValue, ref, update, remove, get } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0FRG69Iy9LfLzlRay3CueSi-y1tFmbdM",
  authDomain: "wildcat-deal.firebaseapp.com",
  databaseURL: "https://wildcat-deal-default-rtdb.firebaseio.com",
  projectId: "wildcat-deal",
  storageBucket: "wildcat-deal.appspot.com",
  messagingSenderId: "822702734561",
  appId: "1:822702734561:web:dd6fe85adbb155f0e04ba0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const storage = getStorage(app);

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(
    () =>
      onValue(
        ref(database, path),
        (snapshot) => {
          setData(snapshot.val());
        },
        (error) => {
          setError(error);
        }
      ),
    [path]
  );

  return [data, error];
};

export const getDbData = async (path) => {
  const snapshot = await get(ref(database, path));
  return snapshot.val();
};

const makeResult = (error) => {
  const timestamp = Date.now();
  const message =
    error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback(
    (value) => {
      update(ref(database, path), value)
        .then(() => setResult(makeResult()))
        .catch((error) => setResult(makeResult(error)));
    },
    [database, path]
  );

  return [updateData, result];
};

export const writeToDb = (path, value) => {
  update(ref(database, path), value)
    .then(() => console.log("Successfully written to database.", value))
    .catch((error) => console.log(error));
};

export const removeDbData = (path) => {
  remove(ref(database, path))
    .then(() => console.log("Successfully removed from database."))
    .catch((error) => console.log(error));
};

export const signInWithGoogle = async (navigate) => {
  const result = await signInWithPopup(getAuth(app), new GoogleAuthProvider())
  // This gives you a Google Access Token. You can use it to access the Google API.
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  sessionStorage.setItem(
    "Auth Token",
    token
  );

  const userId = result.user.uid;

  // Check if the user already exists
  const userExists = await getDbData(`/users/${userId}`);
  if (!userExists) {
    // Now upload user's profile to the database
    const profileData = {
      displayName: result.user.displayName,
      email: result.user.email,
      emailVerified: result.user.emailVerified,
      phoneNumber: result.user.phoneNumber,
      photoURL: result.user.photoURL,
      providerId: result.user.providerId
    };
    await writeToDb(`/users/${userId}`, profileData);
  }

  navigate('/')
};

const firebaseSignOut = () => signOut(getAuth(app));
export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [user, setUser] = useState();

  useEffect(() => onAuthStateChanged(getAuth(app), setUser), []);

  return [user];
};

export const firebaseSendPasswordResetEmail = (email) => {
  const auth = getAuth(app);
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert("Error sending password reset email.");
    });
}

export const signInWithEmailAndPassWD = async (inputs, navigate, setOpenAlert) => {
  const authentication = getAuth(app);
  try {
    const result = await signInWithEmailAndPassword(authentication, inputs.email, inputs.password);
    sessionStorage.setItem(
      "Auth Token",
      result._tokenResponse.refreshToken
    );

    const userId = result.user.uid;

    // Check if the user already exists
    const userExists = await getDbData(`/users/${userId}`);
    if (!userExists) {
      // Now upload user's profile to the database
      const profileData = {
        displayName: result.user.displayName,
        email: result.user.email,
        emailVerified: result.user.emailVerified,
        phoneNumber: result.user.phoneNumber,
        photoURL: result.user.photoURL,
        providerId: result.user.providerId
      };
      await writeToDb(`/users/${userId}`, profileData);
    }

    navigate("/");
  }
  catch (error) {
    if (error.code == "auth/user-not-found" ||
      error.code == "auth/wrong-password") {
      setOpenAlert(true);
    } else if (error.code == "auth/invalid-login-credentials") {
      setOpenAlert(true);
    } else if (error.code == "auth/too-many-requests") {
      alert("Too many failed login attempts. Please try again later.");
    }
    else {
      console.log(error);
    }
  };
};

export default database;
