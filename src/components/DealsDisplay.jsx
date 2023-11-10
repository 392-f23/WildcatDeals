import React, { useState } from "react";
import DealCard from "./DealCard";
import Masonry from '@mui/lab/Masonry';
import Pagination from '@mui/material/Pagination';

const PAGE_SIZE = 30; // Number of deals per page

const DealsDisplay = ({ deals }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(deals.length / PAGE_SIZE);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentDeals = deals.slice(startIndex, startIndex + PAGE_SIZE);

  if (deals.length === 0) {
    return (
      <div className="deals-container">
        <div className="flex justify-center w-full p-6">
          <h1 className="text-xl text-center">No deals found.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="deals-container">
      <div className="events-grid flex justify-center w-full mt-6 px-6">
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }} >
          {currentDeals.map((deal) => (
            <div key={`deal-${deal.id}`} className="event-card flex justify-center">
              <DealCard deal={deal} />
            </div>
          ))}
        </Masonry>
      </div>
      {totalPages > 1 && (
        <div className="pagination-container flex justify-center my-6">
          <Pagination
            count={totalPages}
            onChange={handlePageChange}
            color="secondary"
          />
        </div>
      )}
    </div>
  );
};

export default DealsDisplay;
