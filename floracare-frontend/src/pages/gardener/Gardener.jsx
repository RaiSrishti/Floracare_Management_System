import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardMedia, CardContent,Fab } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios"; // For making API requests
import { Add } from "@mui/icons-material";
import { useSelector } from "react-redux";
// import AddGardener from './GardenerPage';

function GardenerPage() {
  const [gardeners, setGardeners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAdmin = useSelector(state => state.user.isAdmin);

  // Fetch gardeners from backend
  useEffect(() => {
    const fetchGardeners = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gardeners"); // Update this to your backend endpoint
        setGardeners(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gardeners:", error);
        setLoading(false);
      }
    };

    fetchGardeners();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gardeners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + gardeners.length) % gardeners.length);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h5">Loading gardeners...</Typography>
      </Box>
    );
  }

  if (gardeners.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h5">No gardeners available.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ backgroundColor: "#EAF4F4", minWidth: "200vh", minHeight: "100vh", padding: "20px", pt: 10 }}>
        <Typography variant="h3" align="center" sx={{ marginBottom: "40px", color: "#4A6670", my: "27px" }}>
          Meet Our Gardeners
        </Typography>

        {/* Carousel Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            height: "500px",
          }}
        >
          {gardeners.map((gardener, index) => {
            const position =
              index === currentIndex
                ? "center"
                : index === (currentIndex - 1 + gardeners.length) % gardeners.length
                  ? "left"
                  : "right";

            return (
              <Card
                key={gardener.G_id} // Assuming G_id is the primary key
                component={Link}
                to={`/gardener/${gardener.G_id}`}
                sx={{
                  position: "absolute",
                  width: "300px",
                  height: "400px",
                  transition: "transform 0.5s ease, opacity 0.5s ease",
                  transform: {
                    center: "scale(1.2)",
                    left: "translateX(-120%) scale(0.8)",
                    right: "translateX(120%) scale(0.8)",
                  }[position],
                  opacity: position === "center" ? 1 : 0.5,
                  backgroundColor: "#668F80",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <CardMedia
                  component="img"
                  image={gardener.image || "https://via.placeholder.com/200"} // Use the image field from the API response
                  alt={gardener.G_name}
                  sx={{ height: "60%", objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h5" align="center">
                    {gardener.G_name}
                  </Typography>
                  <Typography variant="body2" align="center">
                    {gardener.Experience_level} - {gardener.Specialization}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <Button
            onClick={prevSlide}
            sx={{
              marginRight: "10px",
              backgroundColor: "#4A6670",
              color: "white",
              "&:hover": { backgroundColor: "#668F80" },
            }}
          >
            Previous
          </Button>
          <Button
            onClick={nextSlide}
            sx={{
              backgroundColor: "#4A6670",
              color: "white",
              "&:hover": { backgroundColor: "#668F80" },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    {isAdmin && <Fab color="success" aria-label="add"  sx={{ position: 'fixed', bottom: 16, right: 16 }} component={Link} to="/signup">
      <Add  />
    </Fab>}
    </>
  );
}

export default GardenerPage;
