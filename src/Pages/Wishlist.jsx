
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
} from "@mui/material";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleRemoveFromWishlist = (propertyId) => {
    const updatedWishlist = wishlist.filter((property) => property.id !== propertyId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Your Wishlist
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Back to Properties
        </Button>
      </Box>

      {wishlist.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <Typography variant="h6">No properties in wishlist.</Typography>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {wishlist.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.imageUrls?.[0] || "default-image-url.jpg"}
                  alt={property.propertyTitle}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {property.propertyTitle}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Price: ₹{property.price.toLocaleString("en-IN")}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Location: {property.location}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetails(property.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveFromWishlist(property.id)}
                    >
                      Remove from Wishlist
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Wishlist;
