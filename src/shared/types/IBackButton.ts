import { SxProps, Theme } from "@mui/material";

export interface IBackButton {
  language?: "ar" | "en";
  to: string;
  sx?: SxProps<Theme>;
}
