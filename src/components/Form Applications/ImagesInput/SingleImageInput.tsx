// import { Controller } from "react-hook-form";

// const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// const SingleImageInput = ({
//   control,
//   name,
//   label,
// }: {
//   control: any;
//   name: string;
//   label: string;
// }) => (
//   <Controller
//     name={name}
//     control={control}
//     defaultValue={null}
//     rules={{
//       validate: (file: File | null) => {
//         if (!file) return true;
//         if (file.size > MAX_SIZE) {
//           return "حجم الصورة يجب أن لا يتجاوز 2MB";
//         }
//         return true;
//       },
//     }}
//     render={({ field, fieldState }) => {
//       const preview = field.value ? URL.createObjectURL(field.value) : null;

//       return (
//         <div>
//           <label className="block text-sm text-right font-medium text-gray-700 mb-2">{label}</label>
//           <div
//             className="border-2 border-dashed rounded-lg text-center"
//             onDrop={(e) => {
//               e.preventDefault();
//               field.onChange(e.dataTransfer.files?.[0] || null);
//             }}
//             onDragOver={(e) => e.preventDefault()}
//           >
//             <input
//               type="file"
//               accept="image/*"
//               hidden
//               id={name}
//               onChange={(e) => field.onChange(e.target.files?.[0] || null)}
//               className=""
//             />

//             <label htmlFor={name} className="cursor-pointer block p-4">
//               {preview ? (
//                 <img
//                   src={preview}
//                   className="mx-auto h-32 object-cover rounded"
//                 />
//               ) : (
//                 <span className="text-gray-500 text-sm">
//                   اضغط أو اسحب الصورة هنا
//                 </span>
//               )}
//             </label>

//             {fieldState.error && (
//               <p className="text-red-600 text-sm mt-1">
//                 {fieldState.error.message}
//               </p>
//             )}
//           </div>
//         </div>
//       );
//     }}
//   />
// );

// const MultipleImagesInput = ({
//   control,
//   name,
//   label,
// }: {
//   control: any;
//   name: string;
//   label: string;
// }) => (
//   <Controller
//     name={name}
//     control={control}
//     defaultValue={[]}
//     rules={{
//       validate: (files: File[]) => {
//         if (files.some((f) => f.size > MAX_SIZE)) {
//           return "كل صورة يجب أن لا تتجاوز 2MB";
//         }
//         return true;
//       },
//     }}
//     render={({ field, fieldState }) => {
//       const files: File[] = field.value || [];

//       const addFiles = (fileList: FileList | null) => {
//         if (!fileList) return;
//         field.onChange([...files, ...Array.from(fileList)]);
//       };

//       const removeFile = (index: number) => {
//         field.onChange(files.filter((_, i) => i !== index));
//       };

//       return (
//         <div>
//           <label className="block text-sm mr-[2px] font-medium text-gray-700 mb-2">{label}</label>

//           <div
//             className="border-2 border-dashed rounded-lg text-center"
//             onDrop={(e) => {
//               e.preventDefault();
//               addFiles(e.dataTransfer.files);
//             }}
//             onDragOver={(e) => e.preventDefault()}
//           >
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               hidden
//               id={name}
//               onChange={(e) => addFiles(e.target.files)}
//             />
//             <label
//               htmlFor={name}
//               className="cursor-pointer block p-5 text-sm  text-gray-500"
//             >
//               اضغط أو اسحب الصور هنا
//             </label>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
//             {files.map((file, index) => (
//               <div key={index} className="relative">
//                 <img
//                   src={URL.createObjectURL(file)}
//                   className="h-28 w-full object-cover rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeFile(index)}
//                   className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded px-2"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>

//           {fieldState.error && (
//             <p className="text-red-600 text-sm mt-1">
//               {fieldState.error.message}
//             </p>
//           )}
//         </div>
//       );
//     }}
//   />
// );
// export { SingleImageInput, MultipleImagesInput };


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

const SingleImageInput = ({
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

      const setFile = (file: File | null) => {
        field.onChange(file);
        setPreview(file ? URL.createObjectURL(file) : null);

        if (inputRef.current) inputRef.current.value = "";
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
              cursor: "pointer",
              bgcolor: "#fafafa",
            }}
            onClick={() => inputRef.current?.click()}
          >
            <CardContent>
              <input
                ref={inputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />

              {preview ? (
                <Box position="relative">
                  <img
                    src={preview}
                    style={{
                      maxHeight: 160,
                      margin: "auto",
                      borderRadius: 8,
                    }}
                  />

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
                        setFile(null);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
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
          {preview && (
            <ImageCropDialog
              open={openCrop}
              image={preview}
              onClose={() => setOpenCrop(false)}
              onCropComplete={(file) => setFile(file)}
            />
          )}
        </Box>
      );
    }}
  />
);

export default SingleImageInput;