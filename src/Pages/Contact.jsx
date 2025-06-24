
import React from "react";
import { Box, Typography, Card, CardContent, Link } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Contact = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: { xs: 6, sm: 8, md: 10 },
        paddingBottom: { xs: 3, sm: 4 },
        bgcolor: "#f4f6f8",
        minHeight: "100vh",
        px: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "1.8rem", sm: "2.2rem" },
          textAlign: "center",
        }}
      >
        Contact Us
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{
          maxWidth: 600,
          textAlign: "center",
          fontSize: { xs: "1rem", sm: "1.1rem" },
        }}
      >
        Have a question? Reach out to us and we’ll be happy to help!
      </Typography>

      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          mt: 4,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          boxShadow: 5,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
            }}
          >
            Company Details
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            <LocationOnIcon color="primary" />
            <strong>Branch Address:</strong> Bangalore, Karnataka
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            <PhoneIcon color="primary" />
            <strong>Toll-Free No:</strong> 1-800-EXCEL-ESTATE
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            <EmailIcon color="primary" />
            <strong>Email:</strong> venkataraodama660@gmail.com
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            <AccessTimeIcon color="primary" />
            <strong>Timings:</strong>
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              ml: 4,
              mt: 0.5,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Mon–Fri: 10:00 AM to 6:00 PM <br />
            Sat–Sun: 10:00 AM to 2:00 PM
          </Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          mt: 4,
          textAlign: "center",
          maxWidth: 600,
        }}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
        >
          For any queries or complaints, please fill out our{" "}
          <strong>Feedback Form</strong>:
        </Typography>

        <Link
          href="https://forms.gle/dummyformlink"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            fontWeight: "bold",
            color: "#1976d2",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Submit Feedback
        </Link>
      </Box>
    </Box>
  );
};

export default Contact;
