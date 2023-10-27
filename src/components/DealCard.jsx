import React from 'react';
import "./DealCard.css";

function DealCard({ deal }) {
  return (
    <div className="deal-card">
      <h2>{deal.Name}</h2>
      <p><strong>Discount:</strong> {deal.Discount}</p>
      <p><strong>Address:</strong> {deal.Address}</p>
      <p><strong>Phone:</strong> {deal.Phone}</p>
      <p><strong>Description:</strong> {deal.Description}</p>
      <p><strong>Website:</strong> <a href={deal.Website} target="_blank" rel="noopener noreferrer">{deal.Website}</a></p>
      <p><strong>Email:</strong> {deal.Email}</p>
      <p><strong>Category:</strong> {deal.Category}</p>
    </div>
  );
}

export default DealCard;
