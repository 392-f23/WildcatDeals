import React from 'react';
import "./DealCard.css";

function DealCard({ deal }) {
  // const deal = deals[0]
  console.log("the deal is",deal)
  return (
    <div className="deal-card">
      <h2>{deal.name}</h2>
      <p><strong>Discount:</strong> {deal.discount_info}</p>
      <p><strong>Address:</strong> {deal.address}</p>
      <p><strong>Phone:</strong> {deal.phone}</p>
      <p><strong>Description:</strong> {deal.description}</p>
      <p><strong>Website:</strong> <a href={deal.website} target="_blank" rel="noopener noreferrer">{deal.website}</a></p>
      <p><strong>Email:</strong> {deal.email}</p>
      {/* <p><strong>Category:</strong> {deal.Category}</p> */}
    </div>
  );
}

export default DealCard;
