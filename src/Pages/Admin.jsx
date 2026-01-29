import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  TextField,
  ListItemAvatar,
  Avatar,
  TextField as MuiTextField,
  useMediaQuery,
  useTheme,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_URL = "https://demo-deployment3-3.onrender.com";

const AdminDashboard = ({ onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();

  // State management
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editedRoles, setEditedRoles] = useState({});
  const [activeTab, setActiveTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [todoDate, setTodoDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const roleMessages = {
    BUYER: {
      initialQuery: "Hi, I'm looking for a 3-bedroom house in the Bellandur area. Any suggestions?",
      replies: [
        "Yes, please! Can you send me some options?",
        "What is the price range near that area?",
        "35k-55k. We can negotiate after the property selection",
        "Nice, any with a garage?",
        "Cool, how's the neighborhood?",
      ],
    },
    SELLER: {
      initialQuery: "Hi, how do I list my property on your platform?",
      replies: [
        "Thanks! Could you guide me through the form?",
        "Perfect, how long does approval take?",
        "Got it, what's the listing fee?",
        "Alright, can I upload photos?",
        "Good, how do I track inquiries?",
      ],
    },
    AGENT: {
      initialQuery: "Can you provide me with the latest market trends for my clients?",
      replies: [
        "That's helpful! Can I get a detailed report?",
        "Awesome, can you email it to me?",
        "Thanks, what about last quarter?",
        "Nice, any predictions for next month?",
        "Great, how do I share this with clients?",
      ],
    },
    ADMIN: {
      initialQuery: "I need to update the system settings. Where do I start?",
      replies: [
        "Got it! How do I adjust user Role",
        "Thanks, what about adding new users?",
        "Cool, can I change the theme?",
        "Nice, how do I backup data?",
        "Good, What about future meetings?",
      ],
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, propertiesRes] = await Promise.all([
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/api/properties/all`),
        ]);
        setUsers(usersRes.data);
        setProperties(propertiesRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    setTodos([
      { id: 1, task: "Meeting with team", date: "2025-03-10T10:00" },
      { id: 2, task: "Review project updates", date: "2025-03-12T14:00" },
    ]);
  }, []);
  useEffect(() => {
    if (selectedUser) {
      const { initialQuery } = roleMessages[selectedUser.role] || {
        initialQuery: "Hi, I have a general question!",
      };
      setMessages([
        {
          id: 1,
          senderId: selectedUser.id,
          receiverId: "admin",
          message: initialQuery,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  const handleRoleChange = (id, newRole) => {
    setEditedRoles((prev) => ({ ...prev, [id]: newRole }));
  };

  const saveRoleChange = async (id) => {
    if (!editedRoles[id]) return;
    try {
      await axios.put(
        `${API_URL}/users/${id}/role`,
        { role: editedRoles[id] },
        { headers: { "Content-Type": "application/json" } }
      );
      setUsers(users.map((user) =>
        user.id === id ? { ...user, role: editedRoles[id] } : user
      ));
      setEditedRoles((prev) => {
        const updatedRoles = { ...prev };
        delete updatedRoles[id];
        return updatedRoles;
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role. Please try again.");
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleDeleteProperty = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/properties/${id}`);
      setProperties(properties.filter((property) => property.id !== id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting property:", error);
      setError("Failed to delete property. Please try again.");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/properties/${id}/status`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      setProperties(properties.map((property) =>
        property.id === id ? { ...property, status: newStatus } : property
      ));
    } catch (error) {
      console.error("Error updating property status:", error);
      setError("Failed to update property status. Please try again.");
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedUser) return;

    const newAdminMessage = {
      id: messages.length + 1,
      senderId: "admin",
      receiverId: selectedUser.id,
      message: replyText,
      timestamp: new Date().toISOString(),
    };

    const { replies } = roleMessages[selectedUser.role] || {
      replies: [
        "Cool, can you tell me more?",
        "Thanks, anything else I should know?",
        "Great, what's next?",
        "Nice, can you clarify?",
        "Good, any updates?",
      ],
    };

    const userReplyCount = messages.filter((msg) => msg.senderId !== "admin").length;
    const nextReplyIndex = userReplyCount % replies.length;
    const nextUserReply = replies[nextReplyIndex];

    const newUserMessage = {
      id: messages.length + 2,
      senderId: selectedUser.id,
      receiverId: "admin",
      message: nextUserReply,
      timestamp: new Date(Date.now() + 1000).toISOString(),
    };

    setMessages([...messages, newAdminMessage, newUserMessage]);
    setReplyText("");
  };

  const handleAddTodo = () => {
    if (!newTodo.trim() || !todoDate) return;
    const newTodoItem = {
      id: todos.length + 1,
      task: newTodo,
      date: todoDate
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
    setTodoDate("");
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const getPropertyTypeDistribution = () => {
    const typeCounts = properties.reduce((acc, property) => {
      acc[property.propertyType] = (acc[property.propertyType] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(typeCounts).map((type) => ({
      name: type,
      value: typeCounts[type]
    }));
  };

  const getPriceFluctuationData = () => {
    const sortedProperties = [...properties].sort((a, b) => a.price - b.price);
    return sortedProperties.map((property) => ({
      name: property.propertyTitle,
      price: property.price
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const renderTableCell = (label, value, isMobile) => (
    <TableCell>
      {isMobile ? (
        <Box>
          <Typography variant="caption" color="textSecondary">
            {label}:
          </Typography>
          <Typography variant="body2">{value}</Typography>
        </Box>
      ) : (
        value
      )}
    </TableCell>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: theme.palette.primary.main
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            top: theme.mixins.toolbar.minHeight,
            height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
          }
        }}
      >
        <List>
          {["users", "properties", "messages", "todos"].map((tab) => (
            <ListItem
              button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (isMobile) setSidebarOpen(false);
              }}
              selected={activeTab === tab}
            >
              <ListItemText
                primary={tab.charAt(0).toUpperCase() + tab.slice(1)}
                primaryTypographyProps={{ fontWeight: activeTab === tab ? "bold" : "normal" }}
              />
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem
            button
            onClick={handleLogout}
            sx={{ color: theme.palette.error.main }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 1 : 3,
          width: `calc(100% - ${sidebarOpen ? 240 : 0}px)`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {activeTab === "users" && (
          <Paper sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Users List
            </Typography>
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                    <TableCell><b>Name</b></TableCell>
                    {!isMobile && (
                      <>
                        <TableCell><b>Email</b></TableCell>
                        <TableCell><b>Role</b></TableCell>
                        <TableCell><b>Created At</b></TableCell>
                      </>
                    )}

                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      {renderTableCell("Name", user.name, isMobile)}
                      {!isMobile && (
                        <>
                          {renderTableCell("Email", user.email, isMobile)}
                          {renderTableCell("Role", user.role, isMobile)}
                          {renderTableCell("Created", user.createdAt, isMobile)}
                        </>
                      )}
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 1 }}>
                          <Select
                            value={editedRoles[user.id] || user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            {["BUYER", "SELLER", "AGENT", "ADMIN"].map((role) => (
                              <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                          </Select>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => saveRoleChange(user.id)}
                            disabled={!editedRoles[user.id] || editedRoles[user.id] === user.role}
                          >
                            Save
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        {activeTab === "properties" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Properties Overview
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Property Types Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPropertyTypeDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {getPropertyTypeDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Price Fluctuation
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={getPriceFluctuationData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

            <Paper sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Properties List
              </Typography>
              <TableContainer>
                <Table size={isMobile ? "small" : "medium"}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                      {!isMobile && <TableCell><b>Image</b></TableCell>}
                      <TableCell><b>Title</b></TableCell>
                      {!isMobile && <TableCell><b>Location</b></TableCell>}
                      <TableCell><b>Price</b></TableCell>
                      {!isMobile && <TableCell><b>Type</b></TableCell>}

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        {!isMobile && (
                          <TableCell>
                            <CardMedia
                              component="img"
                              height="60"
                              image={property.imageUrls?.[0] || "default-image-url.jpg"}
                              alt={property.propertyTitle}
                              sx={{ objectFit: "cover", borderRadius: 1 }}
                            />
                          </TableCell>
                        )}
                        {renderTableCell("Title", property.propertyTitle, isMobile)}
                        {!isMobile && renderTableCell("Location", property.location, isMobile)}
                        {renderTableCell("Price", `Rs ${property.price}`, isMobile)}
                        {!isMobile && renderTableCell("Type", property.propertyType, isMobile)}
                        <TableCell>
                          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => {
                                setPropertyToDelete(property.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>

                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {activeTab === "messages" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              Messages
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, height: "100%", minHeight: 400 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Users
                  </Typography>
                  <List>
                    {users.map((user) => (
                      <ListItem
                        button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        selected={selectedUser?.id === user.id}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.name}
                          secondary={user.role}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Paper sx={{ p: 2, height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
                  {selectedUser ? (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Avatar sx={{ mr: 1 }}>
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="h6">
                          Chat with {selectedUser.name}
                        </Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2, p: 1 }}>
                        {messages.map((message) => (
                          <Box
                            key={message.id}
                            sx={{
                              display: "flex",
                              justifyContent: message.senderId === "admin" ? "flex-end" : "flex-start",
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: "80%",
                                bgcolor: message.senderId === "admin" ?
                                  theme.palette.primary.light :
                                  theme.palette.grey[200],
                                p: 1.5,
                                borderRadius: 2,
                                boxShadow: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {message.message}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          placeholder="Type your message..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && replyText.trim()) {
                              handleSendReply();
                            }
                          }}
                          size="small"
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                        >
                          Send
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      textAlign: "center"
                    }}>
                      <Typography variant="body1">
                        Select a user to start chatting
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        {activeTab === "todos" && (
          <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
              To-Do List
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{
                display: "flex",
                gap: 1,
                mb: 2,
                flexDirection: isMobile ? "column" : "row"
              }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  size="small"
                />
                <TextField
                  type="datetime-local"
                  value={todoDate}
                  onChange={(e) => setTodoDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: isMobile ? "100%" : 200 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTodo}
                  disabled={!newTodo || !todoDate}
                  sx={{ minWidth: isMobile ? "100%" : 100 }}
                >
                  Add
                </Button>
              </Box>
              <List>
                {todos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    secondaryAction={
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        Delete
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={todo.task}
                      secondary={new Date(todo.date).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
              {todos.length === 0 && (
                <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                  No tasks scheduled yet.
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleDeleteProperty(propertyToDelete)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;