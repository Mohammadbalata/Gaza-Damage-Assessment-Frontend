import { useLanguage } from "../contexts/LanguageContext";
import { Languages } from "lucide-react";
import { Fab, Tooltip } from "@mui/material";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const isLTR = language === "ar";

  return (
    <Tooltip
      title={isLTR ? "Switch to Arabic" : "Switch to English"}
      placement="left"
    >
      <Fab
        color="primary"
        aria-label="Toggle language"
        onClick={toggleLanguage}
        sx={{
          position: "fixed",
          bottom: 24,
          right: isLTR ? "auto" : 24,
          left: isLTR ? 24 : "auto",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
          },
        }}
      >
        <Languages size={24} />
      </Fab>
    </Tooltip>
  );
};

export default LanguageToggle;
