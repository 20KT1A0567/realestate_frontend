
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

const Details = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [isWishlist, setIsWishlist] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const propertyId = localStorage.getItem("propertyId");

    if (!propertyId || !token) {
      setError("Please log in and select a property.");
      setLoading(false);
      return;
    }

    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`https://demo-deployment3-86e1.onrender.com/property/${propertyId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();
        setProperty(data);
        fetchCoordinates(data.location);
      } catch (error) {
        setError("Error fetching property details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCoordinates = async (location) => {
      try {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location
        )}&format=json&limit=1`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCoordinates({ lat, lon });
        } else {
          setError("Could not find the location on the map.");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setError("Failed to fetch coordinates.");
      }
    };

    fetchPropertyDetails();
  }, []);

  const handleWishlistClick = () => {
    setIsWishlist((prev) => !prev);
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (!isWishlist) {
      wishlist.push(property);
    } else {
      wishlist = wishlist.filter((item) => item.propertyId !== property.propertyId);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const handleBuyNowClick = () => {
    navigate("/order-details", { state: { property } });
  };

  if (loading) return <Typography sx={{ mt: 10 }}>Loading property details...</Typography>;
  if (error) return <Typography color="error" sx={{ mt: 10 }}>{error}</Typography>;

  const { image, propertyName, price, location, description } = property || {};

  return (
    <Box sx={{ padding: 2, marginTop: "60px", minHeight: "100vh" }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ position: "relative", height: isMobile ? "250px" : "400px" }}>
            {image && (
              <img
                src={image}
                alt={propertyName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            )}

            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                "&:hover": { transform: "scale(1.1)" },
                transition: "transform 0.3s ease",
              }}
              onClick={handleWishlistClick}
            >
              {isWishlist ? (
                <Favorite color="error" fontSize="large" />
              ) : (
                <FavoriteBorder color="error" fontSize="large" />
              )}
              <Typography variant="caption" sx={{ color: "red" }}>Wishlist</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>{propertyName}</Typography>
              <Typography variant="body1" gutterBottom><strong>Price:</strong> ₹{price}</Typography>
              <Typography variant="body2" gutterBottom><strong>Location:</strong> {location}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>{description}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} sx={{ height: isMobile ? "250px" : "400px" }}>
          {coordinates ? (
            <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={13} style={{ width: "100%", height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[coordinates.lat, coordinates.lon]}
                icon={new L.Icon({
                  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })}
              >
                <Popup>{propertyName}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <Typography>Location not available</Typography>
          )}
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary">Contact Agent</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="success" onClick={handleBuyNowClick}>Buy Now</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => navigate("/wishlist")}>Go to Wishlist</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Details;
