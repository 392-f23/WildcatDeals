import React, { useState, useEffect } from "react";
import "./App.css";

import Banner from "./components/Banner";
import DealCard from "./components/DealCard";

import { getDbData } from "./utilities/firebase";

const App = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    getDbData("/businesses").then((data) => {
      setBusinesses(data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <div className="App min-h-screen flex flex-col">
      <Banner />
      <div className="flex-grow">
      </div>
      <DealCard deal={businesses} />
      <footer className="w-full p-8">
        <p className="text-center text-default-500 text-sm">Northwestern University</p>
        <p className="text-center text-default-500 text-sm">© 2023 Wildcat Deals</p>
      </footer>

    </div>
  );
};

export default App;
