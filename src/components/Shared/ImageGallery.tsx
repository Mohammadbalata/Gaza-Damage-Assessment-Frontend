import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  ImageList,
  ImageListItem,
  Skeleton,
  alpha,
  useTheme,
  Fade,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  BrokenImage as BrokenImageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";

interface ImageGalleryProps {
  images: string | string[] | null | undefined;
  title?: string;
  columns?: number;
  maxHeight?: number;
  showTitle?: boolean;
}

const ImageGallery = ({
  images,
  title,
  columns = 3,
  maxHeight = 200,
  showTitle = true,
}: ImageGalleryProps) => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  // Normalize to array
  const imageArray: string[] = !images
    ? []
    : typeof images === "string"
    ? [images]
    : images.filter((img) => img && typeof img === "string");

  if (imageArray.length === 0) {
    return null;
  }

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleImageError = (index: number) => {
    setErrorImages((prev) => new Set(prev).add(index));
  };

  const handleOpen = (index: number) => {
    if (!errorImages.has(index)) {
      setSelectedIndex(index);
    }
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < imageArray.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const isRtl = language === "ar";

  return (
    <Box>
      {showTitle && title && (
        <Typography
          variant="subtitle2"
          fontWeight="medium"
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          {title}
        </Typography>
      )}

      <ImageList
        cols={Math.min(columns, imageArray.length)}
        gap={12}
        sx={{
          m: 0,
          overflow: "hidden",
        }}
      >
        {imageArray.map((src, index) => (
          <ImageListItem
            key={`${src}-${index}`}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              cursor: errorImages.has(index) ? "default" : "pointer",
              position: "relative",
              height: maxHeight,
              transition: "all 0.2s ease",
              "&:hover": errorImages.has(index)
                ? {}
                : {
                    transform: "scale(1.02)",
                    boxShadow: `0 4px 20px ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )}`,
                    borderColor: "primary.main",
                    "& .zoom-overlay": {
                      opacity: 1,
                    },
                  },
            }}
            onClick={() => handleOpen(index)}
          >
            {/* Loading Skeleton */}
            {!loadedImages.has(index) && !errorImages.has(index) && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={maxHeight}
                animation="wave"
                sx={{ position: "absolute", top: 0, left: 0 }}
              />
            )}

            {/* Error State */}
            {errorImages.has(index) ? (
              <Box
                sx={{
                  width: "100%",
                  height: maxHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <BrokenImageIcon color="error" fontSize="large" />
                <Typography variant="caption" color="error">
                  {t("images.loadError") || "Failed to load"}
                </Typography>
              </Box>
            ) : (
              <>
                <img
                  src={src}
                  alt={`${title || "Image"} ${index + 1}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  style={{
                    width: "100%",
                    height: maxHeight,
                    objectFit: "cover",
                    display: loadedImages.has(index) ? "block" : "none",
                  }}
                />

                {/* Zoom Overlay */}
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: alpha(theme.palette.common.black, 0.3),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <ZoomInIcon sx={{ color: "white", fontSize: 32 }} />
                </Box>
              </>
            )}
          </ImageListItem>
        ))}
      </ImageList>

      {/* Full-Screen Modal */}
      <Dialog
        open={selectedIndex !== null}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
        BackdropProps={{
          sx: {
            bgcolor: alpha(theme.palette.common.black, 0.9),
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              color: "white",
              bgcolor: alpha(theme.palette.common.white, 0.1),
              "&:hover": {
                bgcolor: alpha(theme.palette.common.white, 0.2),
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation Arrows */}
          {imageArray.length > 1 && (
            <>
              <IconButton
                onClick={isRtl ? handleNext : handlePrev}
                disabled={
                  isRtl
                    ? selectedIndex === imageArray.length - 1
                    : selectedIndex === 0
                }
                sx={{
                  position: "fixed",
                  left: 16,
                  color: "white",
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                  },
                  "&.Mui-disabled": {
                    color: alpha(theme.palette.common.white, 0.3),
                  },
                }}
              >
                <ChevronLeftIcon fontSize="large" />
              </IconButton>

              <IconButton
                onClick={isRtl ? handlePrev : handleNext}
                disabled={
                  isRtl
                    ? selectedIndex === 0
                    : selectedIndex === imageArray.length - 1
                }
                sx={{
                  position: "fixed",
                  right: 16,
                  color: "white",
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.common.white, 0.2),
                  },
                  "&.Mui-disabled": {
                    color: alpha(theme.palette.common.white, 0.3),
                  },
                }}
              >
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </>
          )}

          {/* Image */}
          <Fade in={selectedIndex !== null} timeout={300}>
            <Box
              sx={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedIndex !== null && (
                <img
                  src={imageArray[selectedIndex]}
                  alt={`${title || "Image"} ${selectedIndex + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "85vh",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              )}
            </Box>
          </Fade>

          {/* Image Counter */}
          {imageArray.length > 1 && selectedIndex !== null && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                position: "fixed",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: alpha(theme.palette.common.black, 0.6),
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="white">
                {selectedIndex + 1}
              </Typography>
              <Typography variant="body2" color="grey.500">
                /
              </Typography>
              <Typography variant="body2" color="white">
                {imageArray.length}
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
