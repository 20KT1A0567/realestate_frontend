import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://demo-deployment3-1.onrender.com/auth/forgot-password?email=${email}`,
        { method: "POST" }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      setMessage("OTP sent to your email");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Forgot Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />

          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Send OTP"}
          </Button>
        </form>

        {message && (
          <Typography align="center" sx={{ mt: 2 }} color="primary">
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
