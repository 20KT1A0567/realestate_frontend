
import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import homeBg from "../assets/images/image1.jpg";

const Home = () => {
  const testimonialsRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    location: "",
    price: "",
    size: "",
    category: "",
    type: "buy",
  });

  const scrollToTestimonials = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/${searchParams.type}?${queryString}`);
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: { xs: 2, sm: 4, md: 6 },
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "4rem" },
          }}
        >
          Find Your Dream Property
        </Typography>
        <Typography
          variant="h5"
          sx={{ mt: 1, fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" } }}
        >
          <Link
            to="/buy"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "inherit",
            }}
          >
            Buy
          </Link>{" "}
          |{" "}
          <Link
            to="/rent"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "inherit",
            }}
          >
            Rent
          </Link>{" "}
          |{" "}
          <Link
            to="/sell"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "inherit",
            }}
          >
            Sell
          </Link>
        </Typography>
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.2)",
            p: 3,
            borderRadius: "10px",
            backdropFilter: "blur(8px)",
            mt: 2,
            width: { xs: "100%", sm: "90%", md: "80%" },
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            {Object.entries({
              location: "Location",
              price: "Price",
              size: "Size (sq ft)",
              category: "Category",
            }).map(([key, label]) => (
              <Grid item xs={12} sm={6} md={2.4} key={key}>
                <TextField
                  label={label}
                  name={key}
                  value={searchParams[key]}
                  onChange={handleSearchChange}
                  variant="outlined"
                  fullWidth
                  sx={{ bgcolor: "white" }}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                select
                label="Type"
                name="type"
                value={searchParams.type}
                onChange={handleSearchChange}
                variant="outlined"
                fullWidth
                sx={{ bgcolor: "white" }}
              >
                <MenuItem value="buy">Buy</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
              </TextField>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={2.4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{
                  width: { xs: "100%", sm: "60%", md: "50%" },
                  minWidth: "100px",
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "10px", sm: "20px", md: "30px" },
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button onClick={scrollToTestimonials} sx={{ color: "white" }}>
            <ExpandMoreIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 } }} />
          </Button>
        </Box>
      </Box>
      <Box
        ref={testimonialsRef}
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${homeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          textAlign: "center",
          padding: { xs: 2, sm: 4, md: 6 },
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          What Our Clients Say
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 3,
            px: { xs: 2, sm: 4 },
          }}
        >
          {[
            {
              id: 1,
              text: "Amazing service! Found my dream home effortlessly.",
              author: "Venkatarao D.",
            },
            {
              id: 2,
              text: "Professional and smooth process. Highly recommended!",
              author: "SivaGanesh B.",
            },
            {
              id: 3,
              text: "I sold my house in just 5 days! Thank you.",
              author: "SaiKumar B.",
            },
            {
              id: 4,
              text: "They really care about your needs and help at every step.",
              author: "HemanthKumar P.",
            },
          ].map((testimonial) => (
            <Card
              key={testimonial.id}
              sx={{
                width: "250px",
                bgcolor: "rgba(255,255,255,0.9)",
                borderRadius: "10px",
                transition:
                  "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow:
                    "0px 0px 15px rgba(255,255,255,0.8)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{ fontStyle: "italic", color: "#333" }}
                >
                  "{testimonial.text}"
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1, fontWeight: "bold", color: "#555" }}
                >
                  - {testimonial.author}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "10px", sm: "20px", md: "30px" },
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button onClick={scrollToFooter} sx={{ color: "white" }}>
            <ExpandMoreIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 } }} />
          </Button>
        </Box>
      </Box>
      <Box ref={footerRef}></Box>
    </>
  );
};

export default Home;
