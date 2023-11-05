

import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DealModal from "./DealModal";
import { Button as NextUIButton } from "@nextui-org/react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getDbData, writeToDb } from "../utilities/firebase";
import useEventStore from "../utilities/stores";
import { useNavigate } from 'react-router-dom';
import AverageRating from './AverageRating';
import { IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ShareOnSocial from 'react-share-on-social';
import favicon from "..//favicon.ico";

export default function DealCard({ deal, noShadow, noMap, noPaddings, noDealsPageRedirect }) {
  const [liked, setLiked] = useState(false);
  const user = useEventStore((state) => state.user);
  const navigate = useNavigate();

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
    const maxDiscount = Math.max(...matches.map(match => parseInt(match)));

    // Construct the desired output
    return `check out today to receive up to ${maxDiscount}% off`;
  }

  return (
    <Card sx={{ boxShadow: noShadow ? 0 : 1 }} className={`w-full ${noPaddings ? "" : "p-2"}`} >
      {/* <CardMedia
        component="img"
        alt="green iguana"
        height="100"
        image="/static/images/cards/contemplative-reptile.jpg"
      /> */}
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
                <FavoriteIcon />
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
      <ShareOnSocial
        textToShare={`Check out this awesome deal at ${deal.name} I found on Wildcat Deals! Come and see what you can find!`}
        link={`${window.location.origin}/deals/${deal.id}`}
        linkTitle={`Wildcat Deals | ${deal.name}`}
        linkMetaDesc={deal.description}
        linkFavicon={favicon}
        noReferer
      >
        <IconButton aria-label="share" className='translate-x-2 translate-y-10 absolute right-0 top-0'>
          <ShareIcon />
        </IconButton>
      </ShareOnSocial>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small" onClick={visitWebsite}>Visit Website</Button>
        {!noDealsPageRedirect ? (
          <>
            <div className='sm:hidden'>
              <DealModal deal={deal} noMap={noMap} />
            </div>
            <div className='hidden md:flex'>
              <Button size="small" onClick={() => navigate(`/deals/${deal.id}`)}>Learn More</Button>
            </div>
          </>
        ) :
          <DealModal deal={deal} noMap={noMap} />
        }
      </CardActions>
    </Card>
  );
}