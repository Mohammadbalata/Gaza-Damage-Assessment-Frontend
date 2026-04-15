import * as React from "react";
import { Dialog, DialogContent, Box, Typography, Button, alpha, CircularProgress } from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";
import DamageAssessmentDialog from "../pages/DamageAssessmentDialog";


interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  location?: any;
  isLoading?: boolean;
  canOpenDialogBuildings?: boolean;
  isLocationValid?: boolean;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  location,
  isLoading,
  canOpenDialogBuildings=false,
  isLocationValid,
}) => {


  React.useEffect(() => {
  if (location && !canOpenDialogBuildings && isLocationValid) {
    onClose();
  }
}, [location, canOpenDialogBuildings, isLocationValid]);

  return (
    <Dialog 
      fullWidth 
      maxWidth="sm" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, p: (location && !isLoading) ? 0 : 2  }
      }}
    >
      {isLoading ? (
        <DialogContent sx={{ textAlign: 'center', py: 6 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" fontWeight="bold">
            جاري العمل على تحديد الموقع...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            يرجى الانتظار قليلاً حتى يتم تحديد كافة تفاصيل الموقع بدقة.
          </Typography>
        </DialogContent>
      ) : location && canOpenDialogBuildings ? (
    <DamageAssessmentDialog onClose={onClose} location={location} />
  ) : (
        
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box 
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'error.lighter',
              color: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              mx: 'auto',
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1)
            }}
          >
            <LocationIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            تحديد الموقع بالكامل مطلوب
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 350, mx: 'auto' }}>
            يرجى التأكد من تحديد (المحافظة، البلدية، والحي) بشكل صحيح قبل البدء في تعبئة النموذج.
          </Typography>
          <Button 
            variant="contained" 
            onClick={onClose}
            sx={{ px: 4, borderRadius: 2 }}
          >
            إغلاق
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default FormDialog;
