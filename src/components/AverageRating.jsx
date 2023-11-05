import React, { useState, useEffect } from 'react';
import { Rating } from '@mui/material';
import { getDbData } from "../utilities/firebase";

const AverageRating = ({ dealId }) => {
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchRatingData = async () => {
      const reviewsData = await getDbData(`/reviews/${dealId}`);
      if (reviewsData) {
        setAverageRating(reviewsData.average);
        setReviewCount(reviewsData.user_reviews ? Object.keys(reviewsData.user_reviews).length : 0);
      }
    };

    fetchRatingData();
  }, [dealId]);

  if (averageRating === null) {
    return null;
  }

  return (
    <div className="flex flex-row gap-1">
      {averageRating.toFixed(1)} {/* Assuming you want to round to one decimal */}
      <Rating name="read-only" value={averageRating} readOnly size="small" className="translate-y-0.5" />
      <div className="text-gray-400">({reviewCount})</div>
    </div>
  );
};

export default AverageRating;
