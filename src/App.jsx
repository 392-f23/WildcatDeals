import React, { useState, useEffect } from "react";
import "./App.css";

import Banner from "./components/Banner";
import DealCard from "./components/DealCard";

import { getDbData } from "./utilities/firebase";
import DealModal from "./components/DealModal";

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
      <div className="flex-grow" style={{ paddingTop: '84px' }}>
      </div>
      <DealCard deal={businesses} handleOpenModal={handleOpenModal} />
      <footer className="w-full p-8">
        <p className="text-center text-default-500 text-sm">Northwestern University</p>
        <p className="text-center text-default-500 text-sm">© 2023 Wildcat Deals</p>
      </footer>

    </div>
  );
};

export default App;