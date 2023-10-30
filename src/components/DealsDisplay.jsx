import React, { useState } from "react";
import DealCard from "./DealCard";
import Masonry from '@mui/lab/Masonry';

const DealsDisplay = ({ deals }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };


  return (
    <div className="events-grid flex justify-center w-full p-6">
      <Masonry columns={{ xs: 1, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={2}>
        {deals.map((deal) => (<div key={`deal-${deal.id}`} className="event-card flex justify-center">
          <DealCard
            deal={deal}
            handleOpenModal={handleOpenModal}
          />
        </div>
        ))}
      </Masonry>
    </div>
  );
};
export default DealsDisplay;
