import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DamageAssessmentDialog from "../pages/DamageAssessmentDialog";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  setApplication: any;
  location?: any;
  setIsCurrentLocation?: any;
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  setApplication,
  location,
  setIsCurrentLocation,
}) => {
  return (
    <Dialog className="" open={open} onClose={onClose}>
      <DamageAssessmentDialog
        {...{ setApplication }}
        {...{ onClose }}
        {...{ location }}
        {...{ setIsCurrentLocation }}
      />
    </Dialog>
  );
};

export default FormDialog;
