import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DealModal from "./DealModal";
import { Image } from "@nextui-org/react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getDbData, writeToDb } from "../utilities/firebase";
import useEventStore from "../utilities/stores";
import { useNavigate } from "react-router-dom";
import AverageRating from "./AverageRating";
import ShareIcon from "@mui/icons-material/Share";
import ShareOnSocial from "react-share-on-social";
import favicon from "../favicon.ico";

const defaultImage = "/defaultlogo.png"

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

    const percentPattern = /(\d+)%/g;
    const dollarPattern = /save\s+\$(\d+)/i;
    const dollarOffPattern = /\$(\d+)\s+off/i;
    const freePattern = /(free rent)/i;

    const percentMatches = description.match(percentPattern);
    let dollarMatches = description.match(dollarPattern);
    const dollarOffMatches = description.match(dollarOffPattern);
    const freeMatches = description.match(freePattern);

    if (!percentMatches && !dollarMatches && !freeMatches) {
      if (description.length > 100) {
        return description.substring(0, 100) + "...";
      } else {
        return description;
      }
    }

    let deals = [];

    if (percentMatches) {
      const maxPercent = Math.max(...percentMatches.map(match => parseInt(match)));
      deals.push(`Get up to ${maxPercent}% off!`);
    }

    // Combine dollarMatches and dollarOffMatches, if both are found
    dollarMatches = (dollarMatches && dollarOffMatches) ? dollarMatches.concat(dollarOffMatches) : dollarOffMatches;

    if (dollarMatches) {
      // Since dollarMatches is an array of strings, we'll want to find the largest value
      const maxDollar = Math.max(...dollarMatches.map(match => parseInt(match.match(/\d+/)[0])));
      deals.push(`Get up to $${maxDollar} off!`);
    }

    if (freeMatches) {
      deals.push(`Free rent!`); // Just an example, you might want to customize the text
    }

    return deals;
  };

  // Check if the deal has a logo and set the image URL accordingly
  const imageUrl = deal.logo ? deal.logo : defaultImage;

  return (
    <Card
      className={`w-full ${noPaddings ? "min-w-[300px]" : "p-2"} 
      ${noZoomEffect ? "" : "transition duration-300 ease-in-out transform hover:scale-105"}
      ${noShadow ? "" : "shadow-md hover:shadow-xl z-0 hover:z-10"}
      ${noDealsPageRedirect ? "" : "cursor-pointer"}
      `}
      onClick={handleCardClick}
      sx={{ boxShadow: noShadow ? 0 : 1 }}
    >
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
          <Image src={imageUrl} alt={`${deal.name} logo`} fallbackSrc={defaultImage} width={100} />
          <div className="flex flex-col mb-2">
            <Typography variant="h5" component="div">
              {deal.name}
            </Typography>
            <AverageRating dealId={deal.id} />
          </div>
        </div>
        <Typography variant="body1" color="text.secondary">
          {getMaxDiscount(deal.discount_info)}
        </Typography>
      </CardContent>

      <CardActions className="flex justify-between">
        <div onClick={(e) => e.stopPropagation()}>
          {user && (
              <IconButton aria-label="add to favorites"
                onClick={toggleFavorite}
              >
                {liked ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
          )}
          <ShareOnSocial
            textToShare={`Check out this awesome deal at ${deal.name} I found on Wildcat Deals! Come and see what you can find!`}
            link={`${window.location.origin}/deals/${deal.id}`}
            linkTitle={`Wildcat Deals | ${deal.name}`}
            linkMetaDesc={deal.description}
            linkFavicon={favicon}
            noReferer
            onClick={(e) => e.stopPropagation()}
          >
              <IconButton aria-label="share" onClick={(e) => e.stopPropagation()}>
                <ShareIcon />
              </IconButton>
          </ShareOnSocial>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
            <Button size="small" onClick={visitWebsite}>
              Visit Website
            </Button>
            {noDealsPageRedirect && <DealModal deal={deal} noMap={noMap} />}
        </div>
      </CardActions>

      {/* <CardActions sx={{ justifyContent: "center" }}>
        <Button size="small" onClick={visitWebsite}>
          Visit Website
        </Button>
        {noDealsPageRedirect && <DealModal deal={deal} noMap={noMap} />}
      </CardActions> */}
    </Card>
  );
}

export default DealCard;