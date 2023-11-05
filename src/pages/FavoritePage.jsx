import React, { useState, useEffect } from "react";
import DealsDisplay from "../components/DealsDisplay";
import useDealsStore from "../utilities/stores";
import { Navigate } from 'react-router-dom';
import Filters from "../components/Filters";
import { getDbData } from "../utilities/firebase"; // Ensure this utility function is correctly implemented

const FavoritesPage = () => {
  const user = useDealsStore((state) => state.user);
  const allDeals = useDealsStore((state) => state.business);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const setFavoriteDeals = useDealsStore((state) => state.setFavoriteDeals);
  const favoriteDeals = useDealsStore((state) => state.favoriteDeals);

  // Fetching the favorite deals when the user or allDeals changes
  useEffect(() => {
    const fetchFavoriteDeals = async () => {
      if (user && allDeals.length > 0) {
        const userId = user.uid;
        const path = `/favorites/${userId}/`; // Adjusted path
        try {
          const data = await getDbData(path);
          // Assuming the data returned is an object with deal IDs as keys
          const favoriteDealIds = Object.keys(data);
          const favorites = allDeals.filter(deal => favoriteDealIds.includes(`${deal.id}`));
          setFavoriteDeals(favorites);
          setFilteredDeals(favorites); // Initialize filteredDeals with favorites
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      }
    };

    fetchFavoriteDeals();
  }, [user, allDeals, setFavoriteDeals]);

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <div className="pt-12">
        <Filters deals={favoriteDeals} setFilteredDeals={setFilteredDeals} />
        <DealsDisplay deals={filteredDeals} />
      </div>
    );
  }
};

export default FavoritesPage;
