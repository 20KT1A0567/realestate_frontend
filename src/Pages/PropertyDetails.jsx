
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CardMedia,
  CardContent,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  Box,
  Rating,
  Button,
  Alert,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [rating, setRating] = useState(4.3);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated. Please log in.");

        // Fetch property details
        const propertyResponse = await fetch(
          `https://demo-deployment1-3-rxm7.onrender.com/api/properties/${id}`,
          {
            method: "GET",
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (!propertyResponse.ok) {
          throw new Error(
            `Failed to fetch property details. Status: ${propertyResponse.status}`
          );
        }

        const propertyData = await propertyResponse.json();
        setProperty(propertyData);

        // Fetch coordinates only if location is available
        if (propertyData.location) {
          await fetchCoordinates(propertyData.location);
        } else {
          setError("Property location is missing.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCoordinates = async (location) => {
      try {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location
        )}&format=json&limit=1`;

        // Add timeout and proper headers
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const geocodeResponse = await fetch(geocodeUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'PropertyApp/1.0', // Nominatim requires user agent
          },
        });
        
        clearTimeout(timeoutId);

        if (!geocodeResponse.ok) {
          throw new Error(`Geocoding failed with status: ${geocodeResponse.status}`);
        }

        const geocodeData = await geocodeResponse.json();

        if (geocodeData.length > 0) {
          const { lat, lon } = geocodeData[0];
          setCoordinates({ 
            lat: parseFloat(lat), 
            lon: parseFloat(lon) 
          });
        } else {
          console.warn("Could not find the location on the map:", location);
          // Don't set this as a blocking error since the rest of the page can still work
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        if (error.name === 'AbortError') {
          console.warn("Geocoding request timed out.");
        } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          console.warn("Network error: Unable to connect to geocoding service.");
        } else {
          console.warn("Geocoding failed:", error.message);
        }
        // Don't set this as a main error since it's not critical for the page
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleRatingSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated. Please log in.");

      const ratingData = {
        rating: userRating,
        propertyId: id,
      };

      const response = await fetch(
        "https://demo-deployment1-3-rxm7.onrender.com/ratings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ratingData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit rating.");

      setSuccessMessage("Rating submitted successfully!");
      setUserRating(0);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError(error.message || "Rating submission failed.");
    }
  };

  const handlePayment = () => {
    if (!property) return;
    navigate("/payment", {
      state: {
        propertyId: id,
        userId: property?.seller?.id,
        amount: property.discountedPrice || property.price,
        price: property.price,
        discount: property.discountPercent,
      },
    });
  };

  // ====== UI Loading / Error States ======
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !property) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No property details available.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  // Calculate discounted price
  const discountedPrice = property.discountedPrice || property.price;

  // ====== MAIN RENDER ======
  return (
    <Container sx={{ py: 4, mt: 8, mb: 4 }}>
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Property Image */}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            height="400"
            image={property.imageUrls?.[0] || "/default-property-image.jpg"}
            alt={property.propertyTitle}
            sx={{ 
              objectFit: "cover", 
              borderRadius: 2,
              width: '100%'
            }}
          />
        </Grid>

        {/* Property Information */}
        <Grid item xs={12} md={6}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h4" gutterBottom>
              {property.propertyTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {property.description}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Display Current Rating */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating 
                name="property-rating" 
                value={rating} 
                precision={0.5} 
                readOnly 
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({rating.toFixed(1)}/5)
              </Typography>
            </Box>

            {/* Submit User Rating */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rate this property:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Rating
                  name="user-rating"
                  value={userRating}
                  precision={0.5}
                  onChange={(event, newValue) => setUserRating(newValue)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRatingSubmit}
                  disabled={!userRating}
                  size="small"
                >
                  Submit Rating
                </Button>
              </Box>
            </Box>

            {/* Success Message */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            {/* Property Details */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h5" color="primary">
                    ₹{discountedPrice.toLocaleString("en-IN")}
                  </Typography>
                  {property.discountPercent > 0 && (
                    <>
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{property.price.toLocaleString("en-IN")}
                      </Typography>
                      <Chip
                        label={`${property.discountPercent}% OFF`}
                        color="success"
                        size="small"
                      />
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Location:</strong> {property.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Category:</strong> {property.propertyCategory}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {property.propertyType}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" gutterBottom>
                  <strong>Bedrooms:</strong> {property.numberOfBedrooms}
                </Typography>
                <Typography variant="body2">
                  <strong>Bathrooms:</strong> {property.numberOfBathrooms}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Area:</strong> {property.squareFeet} sq ft
                </Typography>
              </Grid>
            </Grid>

            {/* Seller Details */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Seller Details
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Name:</strong> {property.seller?.name || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {property.seller?.email || 'N/A'}
              </Typography>
            </Box>

            {/* Buy Now Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              fullWidth
              size="large"
              sx={{ py: 1.5 }}
            >
              Buy Now - ₹{discountedPrice.toLocaleString("en-IN")}
            </Button>
          </CardContent>
        </Grid>
      </Grid>

      {/* Map Section */}
      <Box sx={{ mt: 4, height: "300px", borderRadius: 2, overflow: 'hidden' }}>
        {coordinates ? (
          <MapContainer
            center={[coordinates.lat, coordinates.lon]}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordinates.lat, coordinates.lon]}>
              <Popup>
                <Typography variant="subtitle2">
                  {property.propertyTitle}
                </Typography>
                <Typography variant="body2">
                  {property.location}
                </Typography>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              bgcolor: 'background.default',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">
              Map location not available
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PropertyDetails;