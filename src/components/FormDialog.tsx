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
    <Dialog className="" open={open} onClose={onClose}>
      <DamageAssessmentDialog {...{ onClose }} {...{ location }} />
    </Dialog>
  );
};

export default FormDialog;
