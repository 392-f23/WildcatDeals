import React, { useState, useEffect } from "react";
import "./App.css";

import Banner from "./components/Banner";
import DealCard from "./components/DealCard";

import { getDbData } from "./utilities/firebase";

const App = () => {
  const [businesses, setBusinesses] = useState([]);
  const [businesses_meta, setBusinessesMeta] = useState({});

  useEffect(() => {
    getDbData("/wa_data/businesses").then((data) => {
      setBusinesses(data);
    }).catch((error) => {
      console.log(error);
    });
    getDbData("/wa_data/meta").then((data) => {
      setBusinessesMeta(data);
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
