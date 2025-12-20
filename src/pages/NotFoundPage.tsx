import { AlertTriangle } from "lucide-react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/Routes";
import { Home } from "@mui/icons-material";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: "50%",
            bgcolor: "error.50",
            mb: 3,
            color: "error.main",
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        >
          <AlertTriangle size={64} />
        </Box>

        <Typography
          variant="h1"
          sx={{ fontWeight: 800, color: "error.main", mb: 1 }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          Sorry, the page you are looking for does not exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Home />}
          onClick={() => navigate(ROUTES.LAYOUT)}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
