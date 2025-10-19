
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import excelLogo from "../assets/images/image.png";
import login from "../assets/login.png";

const Header = ({ isLoggedIn, username, onLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#123456", width: "100%", zIndex: 1100 }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={excelLogo}
              alt="VenkatEstate Logo"
              style={{
                height: "50px",
                width: "50px",
                objectFit: "cover",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                color: "white",
              }}
            >
              VenkatEstate
            </Typography>
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/buy">
            Buy
          </Button>
          <Button color="inherit" component={Link} to="/rent">
            Rent
          </Button>
          <Button color="inherit" component={Link} to="/sell">
            Sell
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img
              src={login}
              alt={isLoggedIn ? "Logout" : "Login"}
              height={40}
              width={40}
              style={{ borderRadius: "50%", cursor: "pointer" }}
              onClick={toggleDrawer(true)}
            />
            {isLoggedIn && (
              <Typography variant="body2" sx={{ color: "white" }}>
                {username}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem button component={Link} to="/">
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/buy">
                <ListItemText primary="Buy" />
              </ListItem>
              <ListItem button component={Link} to="/rent">
                <ListItemText primary="Rent" />
              </ListItem>
              <ListItem button component={Link} to="/sell">
                <ListItemText primary="Sell" />
              </ListItem>
              <ListItem button component={Link} to="/contact">
                <ListItemText primary="Contact" />
              </ListItem>

              {!isLoggedIn ? (
                <>
                  <ListItem button onClick={handleLoginClick}>
                    <ListItemText primary="Login" />
                  </ListItem>
                  <ListItem button onClick={handleRegisterClick}>
                    <ListItemText primary="Register" />
                  </ListItem>
                </>
              ) : (
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
