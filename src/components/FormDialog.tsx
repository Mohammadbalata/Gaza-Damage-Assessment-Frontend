import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DamageAssessmentDialog from "../pages/DamageAssessmentDialog";


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
      {
        <DamageAssessmentDialog {...{ onClose }} {...{ location }} />
      }
    </Dialog>
  );
};

export default FormDialog;
