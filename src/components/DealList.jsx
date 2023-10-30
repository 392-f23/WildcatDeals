import React from 'react';
import useDealStore from "../store/dealStore";

const DealsList = (deals) => {
    // const deals = useDealStore(state => state.deals);
    console.log("Deals", deals)
    const searchQuery = useDealStore(state => state.searchQuery);

    const filteredDeals = Array.isArray(deals) ? 
    deals.filter(deal => deal.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

return (
    <div>
        {filteredDeals.map(deal => (
            <div> The deal is {deal.name}</div>
        ))}
    </div>
);
}

export default DealsList;