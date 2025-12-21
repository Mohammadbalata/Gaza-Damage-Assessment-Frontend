import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DamageAssessmentDialog from "../pages/DamageAssessmentDialog";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  setApplications: any;
  location?: any;
  setIsCurrentLocation?: any;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  setApplications,
  location,
  setIsCurrentLocation,
}) => {
  return (
    <Dialog className="" open={open} onClose={onClose}>
      <DamageAssessmentDialog
        {...{ setApplications }}
        {...{ onClose }}
        {...{ location }}
        {...{ setIsCurrentLocation }}
      />
    </Dialog>
  );
};

export default FormDialog;
