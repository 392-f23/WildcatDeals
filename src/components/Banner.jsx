import React from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import SearchBar from '../components/Searchbar';

const Banner = () => {
  const pages = [
    { name: "Student Discounts", link: "/" },
    { name: "Public Discounts", link: "/public-discounts" },
    { name: "Map View", link: "/map-view" },
    { name: "Favorite Discounts", link: "/favorites" },
  ];

  const handleSearch = (value) => {
    // Implement the search logic
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#4E2A84' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div"
            sx={{ flexGrow: 0, fontFamily: "monospace", fontWeight: 700, letterSpacing: ".3rem", color: "inherit", textDecoration: "none", mr: 3 }}>
            ʕʘ̅͜ʘ̅ʔ Wildcat Deals
          </Typography>
          <Box sx={{ display: "flex", flexGrow: 0, mr: 'auto', mx: 1 }}>
            {pages.map((page) => (
              <Button key={`nav-${page.name}`} sx={{ my: 2, color: "white", mx: 1 }}>
                {page.name}
              </Button>
            ))}
          </Box>
          <SearchBar handleSearch={handleSearch} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Banner;
