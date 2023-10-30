import { initializeApp } from "firebase/app";
import { useEffect, useState, useCallback } from "react";
import { getDatabase, onValue, ref, update, get } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

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

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(app), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(app));

export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [user, setUser] = useState();

  useEffect(() => onAuthStateChanged(getAuth(app), setUser), []);

  return [user];
};

export default database;
