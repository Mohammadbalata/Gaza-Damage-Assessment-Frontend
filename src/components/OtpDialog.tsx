import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useSnackbar } from "notistack";
import { useLanguage } from "../contexts/LanguageContext";
import SmartphoneIcon from "@mui/icons-material/Smartphone";

// type OtpMethod = "sms" | "whatsapp" | "email";

interface OtpDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify?: (type: string, code: string, target: string) => void;
  onResend?: (type: string, target: string) => void;
  otpValue?: string;
  length?: number;
  phoneNumber?: string;
  email?: string;
  whatsappNumber?: string;
  isSent?: boolean;
}

const OtpDialog = ({
  open,
  onClose,
  onVerify,
  onResend,
  length = 6,
  email,
  // whatsappNumber,
  phoneNumber,
  isSent,
}: OtpDialogProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLanguage();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [method, setMethod] = useState("");
  const [showAnotherWay, setShowAnotherWay] = useState(false);
  const [target, setTarget] = useState("");
  useEffect(() => {
    if (open) {
      inputRefs.current[0]?.focus();
    }
  }, [open]);

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
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    const pasteArray = pasteData.slice(0, length).split("");

    const newOtp = [...otp];

    pasteArray.forEach((num, i) => {
      newOtp[i] = num;
    });

    setOtp(newOtp);

    const nextIndex =
      pasteArray.length >= length ? length - 1 : pasteArray.length;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = (type: string, target: string) => {
    const code = otp.join("");

    if (onVerify) {
      onVerify(type, code, target);
    } else {
      if (code === "123456") {
        enqueueSnackbar("تم التحقق بنجاح ✅", { variant: "success" });
      } else {
        enqueueSnackbar("الرمز غير صحيح ❌", { variant: "error" });
      }
    }
  };

  const handleResend = (method: string, value: string) => {
    onResend?.(method, value);
    console.log("method", method, value);
    setOtp(Array(length).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleClose = () => {
    setOtp(Array(length).fill(""));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      {isSent ? (
        <DialogTitle>{t("form.title")}</DialogTitle>
      ) : (
        <DialogTitle>{t("form.titleVerify")}</DialogTitle>
      )}

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 1,
        }}
      >
        {!isSent && (
          <ToggleButtonGroup
            value={method}
            exclusive
            onChange={(_, value) => value && setMethod(value)}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: "10px",
            }}
          >
            <ToggleButton
              value="sms"
              onClick={() => {
                setTarget(phoneNumber || "");
                handleResend("sms", phoneNumber || "");
              }}
              disabled={method === "sms"}
              sx={{
                "&.Mui-disabled": {
                  cursor: "not-allowed",
                  pointerEvents: "auto",
                  opacity: 0.6,
                },
              }}
            >
              <SmartphoneIcon color="primary" />
              {t("phoneNumber.sms")} : {phoneNumber}
            </ToggleButton>

            {/* <ToggleButton
              value="whatsappNumber"
              onClick={() => {
                setTarget(whatsappNumber || "");
                handleResend("whatsapp", target || "");
              }}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1.2,
                gap: 1,
              }}
            >
              <WhatsAppIcon color="success" />
              {t("form.whatsappNumber")} : {whatsappNumber}
            </ToggleButton> */}

            <ToggleButton
              value="email"
              onClick={() => {
                setTarget(email || "");
                handleResend("email", email || "");
              }}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1.2,
                gap: 1,
                "&.Mui-disabled": {
                  cursor: "not-allowed",
                  pointerEvents: "auto",
                  opacity: 0.6,
                },
              }}
              disabled={method === "email"}
            >
              <EmailIcon color="primary" />
              {t("contact.email")} : {email}
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        {isSent && (
          <>
            <Box sx={{ display: "flex", gap: 1, direction: "ltr" }}>
              {Array.from({ length }).map((_, index) => (
                <TextField
                  key={index}
                  type="tel"
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={otp[index]}
                  onPaste={handlePaste}
                  onChange={(e: any) => handleChange(e, index)}
                  onKeyDown={(e: any) => handleKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1,
                    inputMode: "numeric",
                    style: {
                      textAlign: "center",
                    },
                  }}
                  sx={{ width: 50 }}
                />
              ))}
            </Box>

            <Button
              onClick={() => setShowAnotherWay(!showAnotherWay)}
              variant="text"
              sx={{ textDecoration: "underline" }}
            >
              {t("form.verifySubTitle")}
            </Button>
            {showAnotherWay && (
              <ToggleButtonGroup
                value={method}
                exclusive
                onChange={(_, value) => value && setMethod(value)}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "10px",
                }}
              >
                <ToggleButton
                  value="sms"
                  disabled={method === "sms"}
                  onClick={() => {
                    setTarget(phoneNumber || "");
                    handleResend("sms", phoneNumber || "");
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 1.2,
                    gap: 1,

                    "&.Mui-disabled": {
                      cursor: "not-allowed",
                      pointerEvents: "auto",
                      opacity: 0.6,
                    },
                  }}
                >
                  <SmartphoneIcon color="primary" />
                  {t("phoneNumber.sms")} : {phoneNumber}
                </ToggleButton>

                {/* <ToggleButton
                  value="whatsappNumber"
                  disabled={isDisabled}
                  onClick={() => {
                    setTarget(email || "");
                    handleResend("email", target || "");
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 1.2,
                    gap: 1,
                    "&.Mui-disabled": {
                      cursor: "not-allowed",
                      pointerEvents: "auto",
                      opacity: 0.6,
                    },
                  }}
                >
                  <WhatsAppIcon color="success" />
                  {t("form.whatsappNumber")} : {whatsappNumber}
                </ToggleButton> */}

                <ToggleButton
                  value="email"
                  disabled={method === "email"}
                  onClick={() => {
                    setTarget(email || "");
                    handleResend("email", email || "");
                  }}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    py: 1.2,
                    gap: 1,

                    "&.Mui-disabled": {
                      cursor: "not-allowed",
                      pointerEvents: "auto",
                      opacity: 0.6,
                    },
                  }}
                >
                  <EmailIcon color="primary" />
                  {t("contact.email")} : {email}
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>إلغاء</Button>
        <Button
          disabled={!isSent}
          onClick={() => handleVerify(method, target)}
          variant="contained"
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            py: 1.2,
            gap: 1,
            "&.Mui-disabled": {
              cursor: "not-allowed",
              pointerEvents: "auto",
              opacity: 0.6,
            },
          }}
        >
          تحقق
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpDialog;
