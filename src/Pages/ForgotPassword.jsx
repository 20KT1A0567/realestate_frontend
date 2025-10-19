
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
<<<<<<< HEAD
      const response = await fetch("https://demo-deployment-2rqn.onrender.com/forgot-password", {
=======
      const response = await fetch("http://localhost:9090/forgot-password", {
>>>>>>> 085b89d50b00f188f34f273b50c69688b178f1d5
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link");
      }

      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        px: 2, 
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 3 : 4,
          width: isMobile ? "100%" : isTablet ? 400 : 450,
          maxWidth: "100%",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Forgot Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
          </Button>
        </form>

        {message && (
          <Typography
            color={message.includes("sent") ? "green" : "error"}
            align="center"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}

        <Typography align="center" sx={{ mt: 2 }}>
          <Link to="/login">Back to Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
