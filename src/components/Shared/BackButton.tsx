import { ArrowBack } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IBackButton } from "../../interfaces/IBackButton";

const BackButton = ({ language, to }: IBackButton) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Button
        variant="text"
        startIcon={
          <ArrowBack
            sx={{
              ml: 1,
              transform: language === "ar" ? "rotate(180deg)" : "none",
            }}
          />
        }
        onClick={() => navigate(to)}
        sx={{ fontWeight: 600 }}
      >
        {language === "ar" ? "العودة للصفحة الرئيسية" : "Back to Home"}
      </Button>
    </Box>
  );
};

export default BackButton;
