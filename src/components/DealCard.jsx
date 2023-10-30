

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DealModal from "./DealModal";


export default function DealCard({ deal }) {
  const visitWebsite = () => {
    window.open(deal.website);
  };

  const getMaxDiscount = (description) => {
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
    <Card sx={{ maxWidth: 345, margin: '16px' }}>
      {/* <CardMedia
        component="img"
        alt="green iguana"
        height="100"
        image="/static/images/cards/contemplative-reptile.jpg"
      /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {deal.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          { getMaxDiscount(deal.discount_info)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button size="small" onClick={visitWebsite}>Visit Website</Button>
        <DealModal deal={deal} />
        {/* <Button size="small" onClick={handleOpenModal}>Learn More</Button> */}
        
      </CardActions>
    </Card>
  );
}