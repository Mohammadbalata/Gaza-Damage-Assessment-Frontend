import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useSnackbar } from "notistack";

interface OtpDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify?: (code: string) => void; // يمكن استقبال callback عند التحقق
  onResend?: (otpVal: string) => void; // callback لإعادة إرسال الرمز
  length?: number;
  otpValue?: string; // يمكن استقبال البريد الإلكتروني لإعادة الإرسال
}

const OtpDialog = ({
  open,
  onClose,
  onVerify,
  onResend,
  length = 5,
  otpValue,
}: OtpDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(Array(length).fill(""));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "")) {
        const code = newOtp.join("");
        if (onVerify) {
          onVerify(code);
        } else {
          if (code === "12345") {
            enqueueSnackbar("تم التحقق بنجاح!", { variant: "success" });
            onClose();
            setOtp(Array(length).fill(""));
          } else {
            enqueueSnackbar("الرمز غير صحيح", { variant: "error" });
          }
        }
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else {
      e.target.value = "";
    }
  };
  const handleClose = () => {
    setOtp(Array(length).fill(""));
    onClose();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (onVerify) {
      onVerify(code);
    } else {
      if (code === "12345") {
        enqueueSnackbar("تم التحقق بنجاح!", { variant: "success" });
        setOtp(Array(length).fill(""));
        onClose();
      } else {
        enqueueSnackbar("الرمز غير صحيح", { variant: "error" });
      }
    }
  };

  const handleResend = (otpValue: string) => {
    console.log("otpValue is", otpValue);
    if (onResend) {
      onResend(otpValue);
      enqueueSnackbar("تم إرسال رمز جديد", { variant: "info" });
      setOtp(Array(length).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>ادخل رمز التحقق المرسل اليك </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          mt: 1,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length }).map((_, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={otp[index]}
              onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, index)}
              onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<HTMLInputElement>, index)}
              inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
              sx={{ width: 50 }}
            />
          ))}
        </div>

        <Button
          onClick={() => handleResend(otpValue || "")}
          variant="text"
          sx={{ mt: 2, textDecoration: "underline" }}
        >
          ألم يصلك الرمز؟ إعادة إرسال
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>إلغاء</Button>
        <Button onClick={handleVerify} variant="contained">
          تحقق
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpDialog;
