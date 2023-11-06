import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DealModal from "./DealModal";
import { Button as NextUIButton } from "@nextui-org/react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getDbData, writeToDb } from "../utilities/firebase";
import useEventStore from "../utilities/stores";
import { useNavigate } from "react-router-dom";
import AverageRating from "./AverageRating";
import ShareIcon from "@mui/icons-material/Share";
import ShareOnSocial from "react-share-on-social";
import favicon from "..//favicon.ico";

import defaultImage from './defaultlogo.png';

const DealCard = ({
  deal,
  noShadow,
  noMap,
  noPaddings,
  noDealsPageRedirect,
  noZoomEffect,
}) => {
  const [liked, setLiked] = useState(false);
  const user = useEventStore((state) => state.user);
  const navigate = useNavigate();
  const handleCardClick = (e) => {
    e.stopPropagation();
    if (!noDealsPageRedirect) {
    navigate(`/deals/${deal.id}`);
    }
  };

  // Fetch favorite state from DB
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (user) {
        const path = `/favorites/${user.uid}/${deal.id}`;
        const isFavorite = await getDbData(path);
        setLiked(!!isFavorite);
      }
    };

    fetchFavoriteStatus();
  }, [deal.id, user]);

  const toggleFavorite = async () => {
    const newState = !liked;
    setLiked(newState);
    const path = `/favorites/${user?.uid}`;
    const favoriteUpdate = { [deal.id]: newState ? true : null };

    try {
      await writeToDb(path, favoriteUpdate);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };


  const visitWebsite = () => {
    window.open(deal.website);
  };

  const getMaxDiscount = (description) => {
    // Guard against null or undefined
    if (!description) return null;

    // Match all percentages in the description
    const matches = description.match(/(\d+)%/g);

    // If no matches found, return a default message or null
    if (!matches) return description;

    // Extract percentage values and find the maximum
    const maxDiscount = Math.max(...matches.map((match) => parseInt(match)));

    // Construct the desired output
    return `check out today to receive up to ${maxDiscount}% off`;
  };

  // URL for the default image

  // Check if the deal has a logo and set the image URL accordingly
  const imageUrl = deal.logo ? deal.logo : defaultImage;

  return (
    <Card
      className={`w-full ${noPaddings ? "" : "p-2"} 
      ${noZoomEffect ? "" : "transition duration-300 ease-in-out transform hover:scale-105"}
      ${noShadow ? "" : "shadow-md hover:shadow-xl hover:z-10"}
      ${noDealsPageRedirect ? "" : "cursor-pointer"}`}
      onClick={handleCardClick}
      sx={{ boxShadow: noShadow ? 0 : 1 }}
    >
      <CardMedia
        component="img"
        alt={`${deal.name} logo`}
        height="140" // Adjust the height as necessary
        image={imageUrl}
      />
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="flex flex-col mb-2">
            <Typography variant="h5" component="div">
              {deal.name}
            </Typography>
            <AverageRating dealId={deal.id} />
          </div>
          {user && (
            <NextUIButton
              isIconOnly
              className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
              radius="full"
              variant="light"
              onPress={toggleFavorite}
            >
              {liked ? (
                <FavoriteIcon style={{ color: "#4E2A84" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </NextUIButton>
          )}
        </div>
        <Typography variant="body1" color="text.secondary">
          {getMaxDiscount(deal.discount_info)}
        </Typography>
      </CardContent>
      <div onClick={(e) => e.stopPropagation()}>
        <ShareOnSocial
          textToShare={`Check out this awesome deal at ${deal.name} I found on Wildcat Deals! Come and see what you can find!`}
          link={`${window.location.origin}/deals/${deal.id}`}
          linkTitle={`Wildcat Deals | ${deal.name}`}
          linkMetaDesc={deal.description}
          linkFavicon={favicon}
          noReferer
        >
          <IconButton
            aria-label="share"
            className="translate-x-2 translate-y-10 absolute right-0 top-0"
          >
            <ShareIcon />
          </IconButton>
        </ShareOnSocial>
      </div>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button size="small" onClick={visitWebsite}>
          Visit Website
        </Button>
        {noDealsPageRedirect && <DealModal deal={deal} noMap={noMap} />}
      </CardActions>
    </Card>
  );
}

export default DealCard;