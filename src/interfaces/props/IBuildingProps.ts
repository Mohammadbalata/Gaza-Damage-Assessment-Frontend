import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDamageAssessmentState } from "../store/IDamageAssessmentState";

export interface IBuildingProps {
  register: UseFormRegister<IDamageAssessmentState>;
  errors: FieldErrors<IDamageAssessmentState>;
  watch: any;
  control: any;
  isChangeToReviewPage:boolean,
  setValue?:any
  getValues?:any
}