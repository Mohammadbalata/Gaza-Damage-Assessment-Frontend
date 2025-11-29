export interface IButtonProps {
    label: string  | React.ReactNode;
    className?: string;
    onClick?: Function | any;
    type?: "button" | "submit" | "reset"
}