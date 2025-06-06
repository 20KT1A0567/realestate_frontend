
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  IconButton,
  Box,
  TextField,
  Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const PropertyCard = ({ property, wishlist, handleAddToWishlist, handleViewDetails }) => {
  const isInWishlist = wishlist.some((item) => item.id === property.id);

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={property.imageUrls?.[0] || "default.jpg"}
        alt={property.propertyTitle}
        sx={{ objectFit: "cover" }}
      />
      <IconButton
        onClick={() => handleAddToWishlist(property)}
        sx={{ position: "absolute", top: 8, right: 8 }}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          {property.propertyTitle}
        </Typography>
        <Typography variant="body1" color="primary" mt={1}>
          ₹{property.price.toLocaleString("en-IN")} | {property.discountPercent}% Off
        </Typography>
        <Box display="flex" gap={2} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewDetails(property.id)}
            aria-label="View property details"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const useFetchProperties = (type) => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated. Please log in.");

      const response = await fetch(`https://demo-deployment-latest-3.onrender.com/api/properties/type/${type}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, error, loading, fetchProperties };
};

const Rent = () => {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [searchParams, setSearchParams] = useState({
    location: "",
    price: "",
    size: "",
    category: "",
  });

  const { properties, error, loading } = useFetchProperties("RENT");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchParams({
      location: queryParams.get("location") || "",
      price: queryParams.get("price") || "",
      size: queryParams.get("size") || "",
      category: queryParams.get("category") || "",
    });
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [searchParams, properties]);

  const applyFilters = () => {
    let filtered = properties.filter(
      (property) =>
        (!searchParams.location ||
          property.location?.toLowerCase().includes(searchParams.location.toLowerCase())) &&
        (!searchParams.price || property.price <= Number(searchParams.price)) &&
        (!searchParams.size || property.squareFeet >= Number(searchParams.size)) &&
        (!searchParams.category ||
          property.propertyCategory?.toLowerCase().includes(searchParams.category.toLowerCase()))
    );
    setFilteredProperties(filtered);
  };

  const handleAddToWishlist = (property) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.some((item) => item.id === property.id)
        ? prevWishlist.filter((item) => item.id !== property.id)
        : [...prevWishlist, property];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const handleViewDetails = (propertyId) => navigate(`/property/${propertyId}`);

  const handleSearchChange = (event) => {
    setSearchParams((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <Container sx={{ mt: 8, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexDirection={{ xs: "column", sm: "row" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: { xs: 2, sm: 0 } }}>
          Available Properties for Rent
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/wishlist")}
          startIcon={<FavoriteIcon />}
          aria-label="Go to wishlist"
        >
          Wishlist ({wishlist.length})
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Location"
            name="location"
            value={searchParams.location}
            onChange={handleSearchChange}
            placeholder="Enter location"
            sx={{ flex: 1, mb: 2 }}
          />
          <TextField
            label="Price"
            type="number"
            name="price"
            value={searchParams.price}
            onChange={handleSearchChange}
            sx={{ flex: 1, mb: 2 }}
          />
          <TextField
            label="Min Size (sq ft)"
            type="number"
            name="size"
            value={searchParams.size}
            onChange={handleSearchChange}
            sx={{ flex: 1, mb: 2 }}
          />
          <TextField
            label="Category"
            name="category"
            value={searchParams.category}
            onChange={handleSearchChange}
            placeholder="Apartment, Villa, etc."
            sx={{ flex: 1, mb: 2 }}
          />
        </Box>
      </Paper>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={4}>
        {filteredProperties.map((property) => (
          <Grid item key={property.id} xs={12} sm={6} md={4}>
            <PropertyCard
              property={property}
              wishlist={wishlist}
              handleAddToWishlist={handleAddToWishlist}
              handleViewDetails={handleViewDetails}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Rent;
