import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DamageAssessmentDialog from "../pages/DamageAssessmentDialog";
import { Box, Typography, Button } from "@mui/material";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  location?: any;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  location,
}) => {
  return (
    <Dialog 
      fullWidth 
      maxWidth="sm" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3, p: location?.neighborhood ? 0 : 2  }
      }}
    >
      {location?.neighborhood ? (
        <DamageAssessmentDialog {...{ onClose }} {...{ location }} />
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 4,
            px: 2,
            textAlign: 'center'
          }}
        >
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
              backgroundColor: (theme) => theme.palette.error.main + '15'
            }}
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/>
             <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/>
             <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/>
             <circle cx="12" cy="12" r="10"/>
           </svg>
          </Box>
          
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            تحديد الحي الذي تتواجد فيه مطلوب
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 350 }}>
            يرجى اختيار الحي الذي تتواجد فيه من الخريطة بدقة لتتمكن من تقديم طلب تقييم الأضرار
          </Typography>

          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={onClose}
            sx={{ px: 4, borderRadius: 2 }}
          >
            إغلاق
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default FormDialog;
