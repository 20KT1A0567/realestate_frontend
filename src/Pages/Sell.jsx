
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Box,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyTitle: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercent: "",
    location: "",
    propertyCategory: "",
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    squareFeet: "",
    propertyType: "BUY",
    images: [],
    existingImages: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [propertyId, setPropertyId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      images: event.target.files,
    }));
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setSellerId(Number(id));
    } else {
      setError("Seller ID not found. Please log in.");
      navigate("/login");
    }
  }, [navigate]);

  const fetchPropertyData = async (propertyId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to continue");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`https://demo-deployment10.onrender.com/api/properties/${propertyId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Property not found or you don't have permission to edit it");
      }

      const data = await response.json();
      setFormData({
        ...data,
        existingImages: data.images || [],
        images: [],
      });
      setIsEditing(true);
      setSuccess("Property data loaded successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateClick = () => {
    if (!propertyId) {
      setError("Please enter a valid property ID.");
      return;
    }
    setError(null);
    setSuccess(null);
    fetchPropertyData(propertyId);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !sellerId || !propertyId) {
      setError("Please provide a valid property ID and ensure you're logged in");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/delete/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete property");
      }

      setSuccess("Property deleted successfully");
      setTimeout(() => {
        navigate("/buy");
      }, 1500);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");
    if (!token || !sellerId) {
      setError("Please log in to continue");
      navigate("/login");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((file) => data.append("images", file));
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    data.append("sellerId", sellerId);

    try {
      const url = isEditing
        ? `https://demo-deployment10.onrender.com/api/properties/update/${propertyId}`
        : "https://demo-deployment10.onrender.com/api/properties/add";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process property listing");
      }

      setSuccess(isEditing ? "Property updated successfully" : "Property listed successfully");
      setTimeout(() => {
        navigate("/buy");
      }, 1500);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        {isEditing ? "Edit Your Property" : "List Your Property"}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 4 }}>
        <TextField
          label="Property ID (for update/delete)"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateClick}
            sx={{ mr: 2 }}
            disabled={!propertyId}
          >
            Load for Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDelete}
            disabled={!propertyId}
          >
            Delete Property
          </Button>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              name="propertyTitle"
              value={formData.propertyTitle}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Discount Percent"
              name="discountPercent"
              type="number"
              value={formData.discounted_price}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Bedrooms"
              name="numberOfBedrooms"
              type="number"
              value={formData.numberOfBedrooms}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Bathrooms"
              name="numberOfBathrooms"
              type="number"
              value={formData.numberOfBathrooms}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Square Feet"
              name="squareFeet"
              type="number"
              value={formData.squareFeet}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Property Category</InputLabel>
              <Select 
                name="propertyCategory" 
                value={formData.propertyCategory} 
                onChange={handleChange} 
                required
              >
                <MenuItem value="Residential">Residential</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Industrial">Industrial</MenuItem>
                <MenuItem value="Land">Land</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Property Type</InputLabel>
              <Select 
                name="propertyType" 
                value={formData.propertyType} 
                onChange={handleChange} 
                required
              >
                <MenuItem value="BUY">For Buy</MenuItem>
                <MenuItem value="RENT">For Rent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Existing Images */}
        {isEditing && formData.existingImages.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Existing Images</Typography>
            <Grid container spacing={2}>
              {formData.existingImages.map((imageUrl, index) => (
                <Grid item xs={12} sm={4} md={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={imageUrl}
                      alt={`Property Image ${index + 1}`}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <input 
          type="file" 
          multiple 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ marginTop: '16px' }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ mt: 2 }}
        >
          {isEditing ? "Update Listing" : "Submit Listing"}
        </Button>
      </form>
    </Container>
  );
};

export default Sell;
