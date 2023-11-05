import React, { useState } from "react";
import DealsDisplay from "../components/DealsDisplay";
import useDealsStore from "../utilities/stores";
import Filters from "../components/Filters";

const IndexPage = () => {
  const business = useDealsStore((state) => state.business);
  const [filteredDeals, setFilteredDeals] = useState(business);
  return (
    <div className="pt-12">
      <Filters deals={business} setFilteredDeals={setFilteredDeals} />
      <DealsDisplay deals={filteredDeals} />
    </div>
  );
};

export default IndexPage;