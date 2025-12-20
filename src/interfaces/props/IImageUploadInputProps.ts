import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDamageAssessmentState } from "../store/IDamageAssessmentState";

export interface IndependentBuildingProps {
  register: UseFormRegister<IDamageAssessmentState>;
  errors: FieldErrors<IDamageAssessmentState>;
  watch: any;
  control: any;
}