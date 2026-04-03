import { Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CropIcon from "@mui/icons-material/Crop";
import { useRef, useState, useEffect } from "react";
import { ImageCropDialog } from "./ImageCropDialog";
import classNames from "classnames";
import { useLanguage } from "../../../contexts/LanguageContext";

const MAX_SIZE = 5 * 1024 * 1024;

const SingleImageInput = ({
  control,
  name,
  label,
  isChangeToReviewPage,
  previewAPI,
  isOptional = false,
}: {
  control: any;
  name: string;
  label?: string;
  isChangeToReviewPage?: boolean;
  previewAPI?: any;
  isOptional?: boolean;
  isRequired?: boolean;
}) => {
  const { t, language } = useLanguage();
  const sizeErrorMessage = t("imageUpload.sizeError");

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      rules={{
        // required: isRequired ? t("common.required") : false,
        validate: (file: File | null) => {
          if (!file) return true;
          if (file.size > MAX_SIZE) return sizeErrorMessage;
          return true;
        },
      }}
      render={({ field, fieldState }) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const [preview, setPreview] = useState<string | null>(previewAPI);
        const [openCrop, setOpenCrop] = useState(false);

        // Sync preview with form value
        useEffect(() => {
          if (field.value instanceof File) {
            const url = URL.createObjectURL(field.value);
            setPreview(url);

            return () => URL.revokeObjectURL(url);
          }

          if (typeof field.value === "string") {
            // If the image is a URL from API
            setPreview(field.value);
          }

          if (!field.value) {
            setPreview(null);
          }
        }, [field.value]);

        const setFile = (file: File | null) => {
          if (isChangeToReviewPage) return;
          field.onChange(file);
        };

        return (
          <Box>
            {label && (
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  mb: 1,
                  textAlign: language === "ar" ? "right" : "left",
                  mr: 1,
                  fontWeight: "bold",
                  fontSize: 15,
                }}
              >
                {label}
                {/* {isRequired && (
                  <span style={{ color: "red", marginInlineStart: "4px" }}>
                    *
                  </span>
                )} */}
                {isOptional && (
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                    sx={{ marginInlineStart: "8px" }}
                  >
                    ({t("common.optional")})
                  </Typography>
                )}
              </Typography>
            )}

            <Card
              variant="outlined"
              sx={{
                borderStyle: "dashed",
                textAlign: "center",
                cursor: isChangeToReviewPage ? "default" : "pointer",
                bgcolor: "#fafafa",
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": !isChangeToReviewPage
                  ? {
                      borderColor: "primary.main",
                      bgcolor: "rgba(25, 118, 210, 0.04)",
                    }
                  : {},
              }}
              className={classNames({
                "pointer-events-none": isChangeToReviewPage,
              })}
              onClick={() => {
                if (!isChangeToReviewPage) {
                  inputRef.current?.click();
                }
              }}
            >
              <CardContent
                className={classNames({
                  "bg-gray-200": isChangeToReviewPage,
                  hidden: !preview && isChangeToReviewPage,
                })}
                sx={{ py: 3 }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  disabled={isChangeToReviewPage}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                {preview ? (
                  <Box position="relative">
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        maxHeight: 160,
                        margin: "auto",
                        borderRadius: 8,
                      }}
                    />

                    {!isChangeToReviewPage && (
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: language === "ar" ? "auto" : 6,
                          left: language === "ar" ? 6 : "auto",
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{ bgcolor: "primary.main", color: "#fff" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenCrop(true);
                          }}
                        >
                          <CropIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          sx={{ bgcolor: "error.main", color: "#fff" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange(null);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ py: 2 }}>
                    <CloudUploadIcon
                      fontSize="large"
                      color="action"
                      sx={{ fontSize: 48, mb: 1, opacity: 0.6 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t("imageUpload.clickOrDrag")}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {fieldState.error && (
              <Typography
                color="error"
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  textAlign: language === "ar" ? "right" : "left",
                }}
              >
                {fieldState.error.message}
              </Typography>
            )}

            {/* Crop Dialog */}
            {preview && !isChangeToReviewPage && (
              <ImageCropDialog
                open={openCrop}
                image={preview}
                onClose={() => setOpenCrop(false)}
                onCropComplete={(file) => field.onChange(file)}
              />
            )}
          </Box>
        );
      }}
    />
  );
};

export default SingleImageInput;
