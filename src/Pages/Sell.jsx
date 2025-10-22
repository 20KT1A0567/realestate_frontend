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
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Sell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyTitle: "",
    description: "",
    price: "",
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
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file uploads
  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      images: event.target.files,
    }));
  };

  // Authentication & seller ID check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");

    if (!token || !id) {
      setError("Please log in to continue");
      navigate("/login");
      return;
    }

    if (role !== "SELLER" && role !== "2") {
      setError("Only sellers can list properties. Your role: " + role);
      navigate("/buy");
      return;
    }

    setSellerId(Number(id));
  }, [navigate]);

  // Fetch property data for editing
  const fetchPropertyData = async (propertyId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://demo-deployment1-3-rxm7.onrender.com/api/properties/${propertyId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.status}`);
      }

      const data = await response.json();

      setFormData({
        propertyTitle: data.propertyTitle || "",
        description: data.description || "",
        price: data.price || "",
        discountPercent: data.discountPercent || "",
        location: data.location || "",
        propertyCategory: data.propertyCategory || "",
        numberOfBedrooms: data.numberOfBedrooms || "",
        numberOfBathrooms: data.numberOfBathrooms || "",
        squareFeet: data.squareFeet || "",
        propertyType: data.propertyType || "BUY",
        images: [],
        existingImages: data.images || [],
      });
      setIsEditing(true);
      setSuccess("Property data loaded successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  // Delete property
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !sellerId || !propertyId) {
      setError("Please provide a valid property ID and ensure you're logged in");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://demo-deployment1-3-rxm7.onrender.com/api/properties/delete/${propertyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      setSuccess("Property deleted successfully");
      setTimeout(() => navigate("/buy"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit new or updated property
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token || !sellerId) {
      setError("Please log in to continue");
      navigate("/login");
      setLoading(false);
      return;
    }

    // Create FormData
    const data = new FormData();

    const formFields = {
      propertyTitle: formData.propertyTitle,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      discountPercent: parseFloat(formData.discountPercent) || 0,
      location: formData.location,
      propertyCategory: formData.propertyCategory,
      numberOfBedrooms: parseInt(formData.numberOfBedrooms) || 0,
      numberOfBathrooms: parseInt(formData.numberOfBathrooms) || 0,
      squareFeet: parseFloat(formData.squareFeet) || 0,
      propertyType: formData.propertyType,
      sellerId: sellerId.toString(),
    };

    Object.entries(formFields).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    // Append images
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((file) => data.append("images", file));
    }

    try {
      const url = isEditing
        ? `https://demo-deployment1-3-rxm7.onrender.com/api/properties/update/${propertyId}`
        : "https://demo-deployment1-3-rxm7.onrender.com/api/properties/add";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const responseText = await response.text();
      let result = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit property");
      }

      setSuccess(isEditing ? "Property updated successfully!" : "Property listed successfully!");
      if (!isEditing) {
        setFormData({
          propertyTitle: "",
          description: "",
          price: "",
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
      }

      setTimeout(() => navigate("/buy"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isEditing ? "Edit Your Property" : "List Your Property"}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <Box sx={{ mb: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
        <Typography variant="h6">Property Management</Typography>
        <TextField
          label="Property ID (for update/delete)"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Enter property ID"
          disabled={loading}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdateClick} disabled={!propertyId || loading}>
            {loading ? <CircularProgress size={20} /> : "Load for Update"}
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete} disabled={!propertyId || loading}>
            Delete Property
          </Button>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}><TextField label="Property Title *" name="propertyTitle" value={formData.propertyTitle} onChange={handleChange} fullWidth required disabled={loading} /></Grid>
          <Grid item xs={12}><TextField label="Description *" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} required disabled={loading} /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Price *" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth required disabled={loading} /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Discount Percent" name="discountPercent" type="number" value={formData.discountPercent} onChange={handleChange} fullWidth disabled={loading} /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Location *" name="location" value={formData.location} onChange={handleChange} fullWidth required disabled={loading} /></Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required disabled={loading}>
              <InputLabel>Property Category *</InputLabel>
              <Select name="propertyCategory" value={formData.propertyCategory} onChange={handleChange}>
                <MenuItem value="Residential">Residential</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="Industrial">Industrial</MenuItem>
                <MenuItem value="Land">Land</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}><TextField label="Bedrooms *" name="numberOfBedrooms" type="number" value={formData.numberOfBedrooms} onChange={handleChange} fullWidth required disabled={loading} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Bathrooms *" name="numberOfBathrooms" type="number" value={formData.numberOfBathrooms} onChange={handleChange} fullWidth required disabled={loading} /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Square Feet *" name="squareFeet" type="number" value={formData.squareFeet} onChange={handleChange} fullWidth required disabled={loading} /></Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required disabled={loading}>
              <InputLabel>Property Type *</InputLabel>
              <Select name="propertyType" value={formData.propertyType} onChange={handleChange}>
                <MenuItem value="BUY">For Buy</MenuItem>
                <MenuItem value="RENT">For Rent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {isEditing && formData.existingImages.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Existing Images</Typography>
            <Grid container spacing={2}>
              {formData.existingImages.map((img, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card><CardMedia component="img" height="200" image={img} alt={`Property ${i + 1}`} sx={{ objectFit: 'cover' }} /></Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">{isEditing ? "Add New Images" : "Upload Images *"}</Typography>
          <input type="file" multiple onChange={handleFileChange} accept="image/*" disabled={loading} style={{ marginBottom: '16px', width: '100%' }} />
          <Typography variant="body2">{formData.images.length > 0 ? `${formData.images.length} file(s) selected` : "No files selected"}</Typography>
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ mt: 4 }} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : isEditing ? "Update Property Listing" : "Submit Property Listing"}
        </Button>
      </Box>
    </Container>
  );
};

export default Sell;
