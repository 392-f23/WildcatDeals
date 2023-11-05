import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { NavigationOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from "react-router-dom";
import useDealsStore from "../utilities/stores";
import ReviewModal from "../components/ReviewModal";
import { getDbData } from "../utilities/firebase";
import { Avatar, Divider, Rating } from "@mui/material";
import PhotoGallery from "../components/PhotoGallery";

const DealsPage = () => {
  let navigate = useNavigate();
  let { dealsId } = useParams();
  const deal = useDealsStore((state) => state.business.find(d => `${d.id}` === `${dealsId}`));
  const user = useDealsStore((state) => state.user);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center pt-32">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Deal not found</h1>
        <Button variant="contained" onClick={() => navigate("/")}>Back to deals</Button>
      </div>
    );
  }

  const isoToHowLongAgo = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    if (diff < 2592000000) return `${Math.floor(diff / 604800000)} weeks ago`;
    if (diff < 31536000000) return `${Math.floor(diff / 2592000000)} months ago`;
    return `${Math.floor(diff / 31536000000)} years ago`;
  };

  const navigateTo = (destinationLat, destinationLng) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    const onSuccess = (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destinationLat},${destinationLng}`;
      window.open(googleMapsDirectionsUrl, '_blank');
    };

    const onError = () => {
      alert('Unable to retrieve your location. Starting location may be inaccurate. Please allow location access in your browser.');
      // Just open the google maps directions page without the user's location
      const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
      window.open(googleMapsDirectionsUrl, '_blank');
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  const renderMap = (lat, lng) => (
    <>
      <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="h-60 md:h-96 w-full mb-2 z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
      </MapContainer>
      <Button
        variant="contained"
        endIcon={<NavigationOutlined />}
        onClick={() => navigateTo(deal.lat, deal.long)}
        fullWidth
      >
        Get Directions
      </Button>
    </>
  );

  const fetchReviews = async () => {
    const reviewsData = await getDbData(`reviews/${deal.id}`);
    if (reviewsData && reviewsData.user_reviews) {
      const reviewsArray = await Promise.all(
        Object.entries(reviewsData.user_reviews).map(async ([uid, review]) => {
          const userProfile = await getDbData(`users/${uid}`);
          return {
            ...review,
            uid,
            authorName: userProfile.displayName,
            authorPhoto: userProfile.photoURL,
          };
        })
      );

      setReviews(reviewsArray);
      setAverageRating(reviewsData.average);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto pt-8 px-4">
      <nav className="text-gray-500 mb-4 mt-12" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Button variant="text" onClick={() => navigate("/")} className="text-sm">
              Wildcat Advantage
            </Button>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <span className="text-sm">{deal.name}</span>
          </li>
        </ol>
      </nav>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">

        {/* Left two-thirds column */}
        <div className="md:w-2/3 md:p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">{deal.name}</h2>
              <p className="text-gray-600">{deal.description}</p>
              <div className="mt-4">
                <span className="text-gray-800 font-semibold">Discounts:</span>
                <span className="ml-2 text-gray-600">{deal.discount_info}</span>
              </div>
              {deal.address && (
                <>
                  <div className="mt-4">
                    <span className="text-gray-800 font-semibold">Address:</span>
                    <span className="ml-2 text-gray-600">{deal.address}</span>
                  </div>
                  {deal.lat && deal.long && renderMap(deal.lat, deal.long)}
                </>
              )}
              {deal.phone && (
                <div className="mt-4">
                  <span className="text-gray-800 font-semibold">Phone:</span>
                  <a href={`tel:${deal.phone}`} className="ml-2 text-blue-600 hover:text-blue-800">{deal.phone}</a>
                </div>
              )}
              {deal.email && (
                <div className="mt-4">
                  <span className="text-gray-800 font-semibold">Email:</span>
                  <a href={`mailto:${deal.email}`} className="ml-2 text-blue-600 hover:text-blue-800">{deal.email}</a>
                </div>
              )}
              <div className="mt-4">
                <span className="text-gray-800 font-semibold">Website:</span>
                <a href={deal.website} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">{deal.website}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right one-third column for reviews */}
        <div className="md:w-1/3 p-6 border-l border-gray-200 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Customer Reviews</h3>

          {averageRating && (
            <div className="mb-3">
              <div className="flex flex-row gap-1">
                {averageRating} <Rating name="read-only" value={averageRating} readOnly size="small" className="translate-y-0.5"></Rating>
                <div className="text-gray-400">{`(${reviews.length})`}</div></div>
            </div>
          )}

          <div className="space-y-4 flex-grow">
            {reviews.length > 0 ? (
              reviews.map((review, index) => {
                if (review.text) return (
                  <div key={index} className="text-gray-600">
                    <div className='flex gap-3'>
                      <Avatar src={review.authorPhoto} size="lg" />
                      <div className="flex flex-col">
                        <p className="text-md">{review.authorName}</p>
                        <div className="flex flex-row gap-1">
                          <Rating
                            name="simple-controlled"
                            value={review.rating}
                            readOnly
                            size="small"
                          />
                          <p className="text-small text-default-500">{isoToHowLongAgo(review.time)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1">{review.text}</div>
                    <div className="mt-1">
                      <PhotoGallery images={review.images} />
                    </div>
                    <Divider className="p-2" />
                  </div>
                )
              }
              )
            ) : (
              <div>No reviews yet.</div>
            )}
          </div>
          {user && (
            <div className="mt-4 flex justify-center">
              <ReviewModal deal={deal} fetchReviews={fetchReviews} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
