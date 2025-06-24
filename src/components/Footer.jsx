
import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "relative",
        bottom: 0,
        width: "100%",
        bgcolor: "#123456",
        color: "white",
        textAlign: "center",
        py: 3,
        mt: "auto",
        px: { xs: 2, sm: 3, md: 5 },
      }}
    >
      <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
        © 2025 VenkatEstate. All rights reserved.
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        alignItems="center"
        spacing={{ xs: 1, sm: 3 }}
        sx={{ mt: 2 }}
      >
        <Link href="/about" color="inherit" underline="hover" sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
          About Us
        </Link>
        <Link href="/careers" color="inherit" underline="hover" sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
          Careers
        </Link>
        <Link href="/terms" color="inherit" underline="hover" sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
          Terms & Conditions
        </Link>
        <Link href="/privacy" color="inherit" underline="hover" sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
          Privacy Policy
        </Link>
        <Link href="/faqs" color="inherit" underline="hover" sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>
          FAQs
        </Link>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 2,
          fontSize: { xs: "1rem", sm: "1.2rem" },
        }}
      >
        <Facebook sx={{ cursor: "pointer", fontSize: { xs: 24, sm: 28 } }} />
        <Instagram sx={{ cursor: "pointer", fontSize: { xs: 24, sm: 28 } }} />
        <Twitter sx={{ cursor: "pointer", fontSize: { xs: 24, sm: 28 } }} />
      </Box>
    </Box>
  );
};

export default Footer;

