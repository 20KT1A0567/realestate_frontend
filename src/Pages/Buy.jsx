
import React, { useState, useEffect } from "react";
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

const Buy = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    location: "",
    price: "",
    size: "",
    category: "",
  });

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

    fetchProperties();
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [searchParams, properties]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated. Please log in.");

      const response = await fetch("http://localhost:9090/api/properties/type/BUY", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = properties.filter((property) => {
      return (
        (!searchParams.location ||
          property.location?.toLowerCase().includes(searchParams.location.toLowerCase())) &&
        (!searchParams.price || property.price <= Number(searchParams.price)) &&
        (!searchParams.size || property.squareFeet >= Number(searchParams.size)) &&
        (!searchParams.category ||
          property.propertyCategory?.toLowerCase().includes(searchParams.category.toLowerCase()))
      );
    });
    setFilteredProperties(filtered);
  };

  const handleAddToWishlist = (property) => {
    setWishlist((prevWishlist) => {
      const isAlreadyInWishlist = prevWishlist.some((item) => item.id === property.id);
      const updatedWishlist = isAlreadyInWishlist
        ? prevWishlist.filter((item) => item.id !== property.id)
        : [...prevWishlist, property];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 2, md: 4 } }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={4}
        gap={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Available Properties for Buy
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/wishlist")}
          startIcon={<FavoriteIcon />}
          sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
        >
          Wishlist ({wishlist.length})
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={searchParams.location}
            onChange={handleSearchChange}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            name="price"
            value={searchParams.price}
            onChange={handleSearchChange}
          />
          <TextField
            fullWidth
            label="Min Size (sq ft)"
            type="number"
            name="size"
            value={searchParams.size}
            onChange={handleSearchChange}
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={searchParams.category}
            onChange={handleSearchChange}
          />
        </Box>
      </Paper>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {filteredProperties.map((property) => (
          <Grid item key={property.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
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
                height="200"
                image={property.imageUrls?.[0] || "default.jpg"}
                alt={property.propertyTitle}
                sx={{ objectFit: "cover" }}
              />
              <IconButton
                onClick={() => handleAddToWishlist(property)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                {wishlist.some((item) => item.id === property.id) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {property.propertyTitle}
                </Typography>
                <Typography variant="body1" color="primary" mt={1}>
                  ₹{property.price.toLocaleString("en-IN")} | {property.discountPercent}% Off
                </Typography>
                <Box display="flex" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(property.id)}
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Buy;
