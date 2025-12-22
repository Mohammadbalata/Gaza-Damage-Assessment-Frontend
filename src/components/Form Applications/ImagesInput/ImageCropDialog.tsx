import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Slider,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ImageCropDialogProps {
  open: boolean;
  image: string;
  onClose: () => void;
  onCropComplete: (file: File) => void;
}

export const ImageCropDialog = ({
  open,
  image,
  onClose,
  onCropComplete,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });

  const getCroppedImg = async () => {
    const imageEl = await createImage(image);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      imageEl,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(
          new File([blob!], "cropped-image.jpg", {
            type: "image/jpeg",
          })
        );
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    const file = await getCroppedImg();
    onCropComplete(file);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box position="relative" width="100%" height={300}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
          />
        </Box>

        <Box mt={2}>
          <Typography variant="body2">التكبير</Typography>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(_, v) => setZoom(v as number)}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button variant="contained" onClick={handleSave}>
          حفظ
        </Button>
      </DialogActions>
    </Dialog>
  );
};
