import React, { useState, useEffect } from "react";
import "./App.css";

import Banner from "./components/Banner";
import { getDbData } from "./utilities/firebase";
import DealsDisplay from "./components/DealsDisplay";

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    getDbData("/businesses").then((data) => {
      setBusinesses(data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  if (!businesses.length) return null;

  return (
    <div className="App min-h-screen flex flex-col">
      <Banner />
      <div className="flex-grow" style={{ paddingTop: '84px' }}>
        <DealsDisplay deals={businesses} />
      </div>
      <footer className="w-full p-8">
        <p className="text-center text-default-500 text-sm">Northwestern University</p>
        <p className="text-center text-default-500 text-sm">© 2023 Wildcat Deals</p>
      </footer>

    </div>
  );
};

export default App;