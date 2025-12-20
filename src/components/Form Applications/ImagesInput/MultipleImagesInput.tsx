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
import { useRef, useState } from "react";
import { ImageCropDialog } from "./ImageCropDialog";

const MAX_SIZE = 2 * 1024 * 1024;

const MultipleImagesInput = ({
  control,
  name,
  label,
}: {
  control: any;
  name: string;
  label: string;
}) => (
  <Controller
    name={name}
    control={control}
    defaultValue={[]}
    rules={{
      validate: (files: File[]) => {
        if (files.some((f) => f.size > MAX_SIZE)) {
          return "كل صورة يجب أن لا تتجاوز 2MB";
        }
        return true;
      },
    }}
    render={({ field, fieldState }) => {
      const inputRef = useRef<HTMLInputElement | null>(null);
      const files: File[] = field.value || [];

      const [cropIndex, setCropIndex] = useState<number | null>(null);

      const addFiles = (newFiles: File[]) => {
        field.onChange([...files, ...newFiles]);
        if (inputRef.current) inputRef.current.value = "";
      };

      const replaceFile = (index: number, file: File) => {
        const updated = [...files];
        updated[index] = file;
        field.onChange(updated);
      };

      const removeFile = (index: number) => {
        field.onChange(files.filter((_, i) => i !== index));
      };

      const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files || []);
        addFiles(dropped);
      };

      return (
        <Box>
          <label className="block text-sm font-medium mb-2 ">
            {label}
          </label>

          {/* Drop Area */}
          <Card
            variant="outlined"
            sx={{
              borderStyle: "dashed",
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "#fafafa",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <CardContent>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={(e) =>
                  addFiles(Array.from(e.target.files || []))
                }
              />
              <CloudUploadIcon fontSize="large" color="action" />
              <Typography variant="body2" color="text.secondary">
                اضغط أو اسحب الصور هنا
              </Typography>
            </CardContent>
          </Card>

          {/* Preview Grid */}
          <Box
            mt={2}
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
            gap={1}
          >
            {files.map((file, index) => {
              const preview = URL.createObjectURL(file);

              return (
                <Box key={index} position="relative">
                  <img
                    src={preview}
                    style={{
                      width: "100%",
                      height: 110,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />

                  {/* Actions */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ bgcolor: "primary.main", color: "#fff" }}
                      onClick={() => setCropIndex(index)}
                    >
                      <CropIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      sx={{ bgcolor: "error.main", color: "#fff" }}
                      onClick={() => removeFile(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })}
          </Box>

          {fieldState.error && (
            <Typography color="error" variant="caption">
              {fieldState.error.message}
            </Typography>
          )}

          {/* Crop Dialog */}
          {cropIndex !== null && files[cropIndex] && (
            <ImageCropDialog
              open
              image={URL.createObjectURL(files[cropIndex])}
              onClose={() => setCropIndex(null)}
              onCropComplete={(file) => {
                replaceFile(cropIndex, file);
                setCropIndex(null);
              }}
            />
          )}
        </Box>
      );
    }}
  />
);

export default MultipleImagesInput;