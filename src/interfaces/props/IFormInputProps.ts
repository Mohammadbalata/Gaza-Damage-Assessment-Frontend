export interface IFormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  register?: any;
  errors?: any;
  validation?: any;
  maxLength?: number;
  defaultValue?: any;
  isRequired?: boolean;
  isEye?: boolean;
  isCopyIcon?: boolean;
  classNameParent?:string;
  setPassword?:any;
  setIsTouchInput?:any
}
