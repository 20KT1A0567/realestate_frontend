import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `https://demo-deployment3-3.onrender.com/auth/reset-password?email=${email}&otp=${otp}&newPassword=${newPassword}`,
        { method: "POST" }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      setMessage("Password reset successful. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
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
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            disabled
            margin="normal"
          />

          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Reset Password"}
          </Button>
        </form>

        {message && (
          <Typography align="center" sx={{ mt: 2 }} color={message.includes("successful") ? "success.main" : "error"}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ResetPassword;
