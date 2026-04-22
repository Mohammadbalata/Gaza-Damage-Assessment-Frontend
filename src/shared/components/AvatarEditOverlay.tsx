import React, { useRef, useState } from "react";
import { Avatar, Box, Typography, Badge } from "@mui/material";
import {
  Person as PersonIcon,
  CameraAlt as CameraIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../app/providers/LanguageContext";

interface AvatarEditOverlayProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File) => void;
  size?: number;
  previewUrl?: string | null;
}

/**
 * Avatar component with hover/tap edit functionality
 * Shows overlay on hover (desktop) or badge (mobile) to indicate editability
 */
const AvatarEditOverlay: React.FC<AvatarEditOverlayProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 80,
  previewUrl,
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Use preview URL if available, otherwise use current avatar
  const displayImage = previewUrl || currentAvatar;

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(t("imageUpload.sizeError"));
        return;
      }
      onAvatarChange(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) return;

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(t("imageUpload.sizeError"));
        return;
      }

      onAvatarChange(file);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        border: isDragging ? "2px dashed #1976d2" : "none",
        borderRadius: "50%",
        bgcolor: isDragging ? "rgba(25,118,210,0.3)" : "rgba(0,0,0,0.5)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Avatar with conditional overlay */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          // Mobile badge (always visible on small screens)
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              bgcolor: "primary.main",
              borderRadius: "50%",
              p: 0.5,
              border: "2px solid white",
            }}
          >
            <CameraIcon sx={{ fontSize: 14, color: "white" }} />
          </Box>
        }
      >
        <Avatar
          src={displayImage || undefined}
          sx={{
            width: size,
            height: size,
            bgcolor: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.3)",
            transition: "all 0.2s ease",
            "& img": {
              objectFit: "cover",
            },
          }}
        >
          <PersonIcon sx={{ fontSize: size * 0.5 }} />
        </Avatar>
      </Badge>

      {/* Hover overlay (desktop only) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "50%",
          bgcolor: "rgba(0,0,0,0.5)",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <CameraIcon sx={{ color: "white", fontSize: 24, mb: 0.5 }} />
        <Typography
          variant="caption"
          sx={{
            color: "white",
            fontWeight: 500,
            textAlign: "center",
            px: 1,
          }}
        >
          {t("imageUpload.editPhoto")}
        </Typography>
      </Box>
    </Box>
  );
};

export default AvatarEditOverlay;
