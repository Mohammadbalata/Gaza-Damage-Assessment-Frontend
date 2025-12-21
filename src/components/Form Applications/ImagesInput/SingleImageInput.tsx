// import { Controller } from "react-hook-form";
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Box,
//   Stack,
// } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CropIcon from "@mui/icons-material/Crop";
// import { useRef, useState } from "react";
// import { ImageCropDialog } from "./ImageCropDialog";
// import classNames from "classnames";

// const MAX_SIZE = 2 * 1024 * 1024;

// const SingleImageInput = ({
//   control,
//   name,
//   label,
//   isChangeToReviewPage,
// }: {
//   control: any;
//   name: string;
//   label: string;
//   isChangeToReviewPage:boolean
// }) => (
//   <Controller
//     name={name}
//     control={control}
//     defaultValue={null}
//     rules={{
//       validate: (file: File | null) => {
//         if (!file) return true;
//         if (file.size > MAX_SIZE)
//           return "حجم الصورة يجب أن لا يتجاوز 2MB";
//         return true;
//       },
    
//     }}
//     render={({ field, fieldState }) => {
//       const inputRef = useRef<HTMLInputElement | null>(null);
//       const [preview, setPreview] = useState<string | null>(null);
//       const [openCrop, setOpenCrop] = useState(false);

//       const setFile = (file: File | null) => {
//         field.onChange(file);
//         setPreview(file ? URL.createObjectURL(file) : null);

//         if (inputRef.current) inputRef.current.value = "";
//       };

//       return (
//         <Box>
//           <label className="block text-sm font-medium mb-2">
//             {label}
//           </label>

//           <Card
//             variant="outlined"
//             sx={{
//               borderStyle: "dashed",
//               textAlign: "center",
//               cursor: "pointer",
//               bgcolor: "#fafafa",
//             }}
//             className={classNames({"pointer-events-none":isChangeToReviewPage})}
//             onClick={() => inputRef.current?.click()}
//           >
//             <CardContent>
//               <input
//                 ref={inputRef}
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={(e) =>
//                   setFile(e.target.files?.[0] || null)
//                 }
//               />

//               {preview ? (
//                 <Box position="relative">
//                   <img
//                     src={preview}
//                     style={{
//                       maxHeight: 160,
//                       margin: "auto",
//                       borderRadius: 8,
//                     }}
//                   />

//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     sx={{ position: "absolute", top: 6, right: 6 }}
//                   >
//                     <IconButton
//                       size="small"
//                       sx={{ bgcolor: "primary.main", color: "#fff" }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setOpenCrop(true);
//                       }}
//                     >
//                       <CropIcon fontSize="small" />
//                     </IconButton>

//                     <IconButton
//                       size="small"
//                       sx={{ bgcolor: "error.main", color: "#fff" }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setFile(null);
//                       }}
//                     >
//                       <DeleteIcon fontSize="small" />
//                     </IconButton>
//                   </Stack>
//                 </Box>
//               ) : (
//                 <>
//                   <CloudUploadIcon fontSize="large" color="action" />
//                   <Typography variant="body2" color="text.secondary">
//                     اضغط أو اسحب الصورة هنا
//                   </Typography>
//                 </>
//               )}
//             </CardContent>
//           </Card>

//           {fieldState.error && (
//             <Typography color="error" variant="caption">
//               {fieldState.error.message}
//             </Typography>
//           )}

//           {/* Crop Dialog */}
//           {preview && (
//             <ImageCropDialog
//               open={openCrop}
//               image={preview}
//               onClose={() => setOpenCrop(false)}
//               onCropComplete={(file) => setFile(file)}
//             />
//           )}
//         </Box>
//       );
//     }}
//   />
// );

// export default SingleImageInput;

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

const MAX_SIZE = 2 * 1024 * 1024;

const SingleImageInput = ({
  control,
  name,
  label,
  isChangeToReviewPage,
}: {
  control: any;
  name: string;
  label: string;
  isChangeToReviewPage?: boolean;
}) => (
  <Controller
    name={name}
    control={control}
    defaultValue={null}
    rules={{
      validate: (file: File | null) => {
        if (!file) return true;
        if (file.size > MAX_SIZE)
          return "حجم الصورة يجب أن لا يتجاوز 2MB";
        return true;
      },
    }}
    render={({ field, fieldState }) => {
      const inputRef = useRef<HTMLInputElement | null>(null);
      const [preview, setPreview] = useState<string | null>(null);
      const [openCrop, setOpenCrop] = useState(false);

      // ✅ مزامنة preview مع قيمة الفورم
      useEffect(() => {
        if (field.value instanceof File) {
          const url = URL.createObjectURL(field.value);
          setPreview(url);

          return () => URL.revokeObjectURL(url);
        }

        if (typeof field.value === "string") {
          // في حال كانت الصورة URL من API
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
          <label className="block text-sm font-medium mb-2">
            {label}
          </label>

          <Card
            variant="outlined"
            sx={{
              borderStyle: "dashed",
              textAlign: "center",
              cursor: isChangeToReviewPage ? "default" : "pointer",
              bgcolor: "#fafafa",
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
            <CardContent className={classNames({"bg-gray-200":isChangeToReviewPage , 'hidden' : (!preview && isChangeToReviewPage)})}>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept="image/*"
                disabled={isChangeToReviewPage}
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
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
                      sx={{ position: "absolute", top: 6, right: 6 }}
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
                <>
                  <CloudUploadIcon fontSize="large" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    اضغط أو اسحب الصورة هنا
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>

          {fieldState.error && (
            <Typography color="error" variant="caption">
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

export default SingleImageInput;
