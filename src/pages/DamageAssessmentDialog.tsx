import DamageAssessmentForm from "../components/Form Applications/DamageAssessmentForm";

interface DamageAssessmentDialogProps {
  onClose: () => void;
  location: any;
  readOnly?: boolean;
  initialData?: any;
  onSuccess?: () => void;
}

const DamageAssessmentDialog = ({
  onClose,
  location,
  readOnly = false,
  initialData,
  onSuccess,
}: DamageAssessmentDialogProps) => {
  return (
    <DamageAssessmentForm
      onClose={onClose}
      location={location}
      readOnly={readOnly}
      initialData={initialData}
      onSuccess={onSuccess}
      isPage={false}
    />
  );
};

export default DamageAssessmentDialog;
