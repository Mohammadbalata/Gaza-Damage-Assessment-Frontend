import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/redux"; // Removed AlertCircle import as it's replaced by MUI Alert

import { ROUTES } from "../../../app/router/Routes";
import { signUp } from "../../../app/store/slices/authSlice";
import { axiosClient } from "../../../shared/api/api";
import { setCitizenName } from "../../../shared/utils/storage";
import AuthComp from "./AuthComp";
import dayjs from "dayjs";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import { API } from "../../../shared/constants/ApiRoutes";
import LanguageToggle from "../../../shared/ui/LanguageToggle";

interface FormData {
  [key: string]: string;
}

const VerificationQuestionsPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");

  const { verificationQuestion, loading: loadingStore } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(loadingStore);
  const [loadingInput, setLoadingInput] = useState(false);

  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    console.log(
      "VerificationQuestionsPage Mount - Questions Length:",
      verificationQuestion?.length,
    );
    if (verificationQuestion?.length === 0) {
      setLoading(true);
      dispatch(
        signUp({
          national_id: id ?? "",
          password: "",
          pathSignUp: `${API.citizen.auth.verifyQuestions}`,
        }),
      )
        .unwrap()
        .then(() => {
          console.log("Fetch questions success");
        })
        .catch((err: any) => {
          console.error("Fetch questions failed:", err);
          setError(err || "Failed to fetch verification questions");
          setLoading(false);
          // Don't redirect immediately so the user can see the error
        });
    } else {
      setQuestions(verificationQuestion);
      setLoading(loadingStore);
      console.log("Using questions from store:", verificationQuestion);
    }
  }, [verificationQuestion, dispatch, id, loadingStore, navigate]);
  console.log(questions);

  const onSubmit = async (formData: FormData) => {
    setLoadingInput(true);
    let answers: { [key: string]: string } = {};

    for (let key in formData) {
      let value = formData[key];
      if (value !== "") {
        if (key.toString().split("_").pop() === "bd") {
          const [year, month, day] = value.split("-");
          value = `${day}/${month}/${year}`;
        }

        answers[key] = value;
      }
    }
    console.log("questions", questions);

    try {
      const res = await axiosClient.post(
        `${API.citizen.auth.verifyQuestions}`,
        {
          national_id: id,
          answers: answers,
        },
      );
      setLoadingInput(false);
      navigate(`${ROUTES.PASSWORD_DISPLAY}?id=${id}`);
      setCitizenName(res?.data?.citizen);
    } catch (error: any) {
      setLoadingInput(false);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  if (questions.length === 0 && loading === false) {
    return (
      <AuthComp title={t("auth.verifyQuesTitle")}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Alert severity="error" sx={{ width: "100%" }}>
            National ID not found in civil registry
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`${ROUTES.SIGNIN}`)}
            startIcon={
              <ArrowBack
                sx={{
                  transform: language === "ar" ? "rotate(180deg)" : "none",
                }}
              />
            }
          >
            {t("common.back")}
          </Button>
        </Stack>
      </AuthComp>
    );
  }

  return (
    <AuthComp title={t("auth.verifyQuesTitle")}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("auth.verifyQuesTitle")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("auth.verifyQuesBody")}
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {questions.map((question, index) => (
            <Box key={question.key}>
              <Typography
                variant="body2"
                color="primary.light"
                sx={{ mb: 1 }}
                fontWeight={600}
              >
                {index + 1}.{" "}
                {language === "ar" ? question.question : question.en_question}
              </Typography>
              {question.key.toString().split("_").pop() === "bd" ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name={question.key}
                    control={control}
                    rules={{ required: t("common.required") }}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date ? date.format("YYYY-MM-DD") : "");
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors[question.key],
                            helperText: errors[question.key]?.message as string,
                            sx: {
                              direction: "ltr",
                              width: "100%",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              ) : (
                <TextField
                  key={question.key}
                  type="text"
                  fullWidth
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  error={!!errors[question.key]}
                  helperText={errors[question.key]?.message as string}
                  {...register(question.key, {
                    required: t("common.required"),
                  })}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  placeholder={
                    language === "ar" ? "أدخل الإجابة" : "Enter your answer"
                  }
                />
              )}
            </Box>
          ))}

          <Stack direction="row" spacing={2} sx={{ mt: 2 }} useFlexGap={true}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => navigate(`${ROUTES.SIGNIN}`)}
              startIcon={
                <ArrowBack
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    mx: 1,
                  }}
                />
              }
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {t("common.back")}
            </Button>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loadingInput}
              startIcon={
                loadingInput ? (
                  <CircularProgress sx={{ mx: 1 }} size={20} color="inherit" />
                ) : (
                  <CheckCircle sx={{ mx: 1 }} />
                )
              }
              sx={{ py: 1.5, fontWeight: 600 }}
            >
              {loadingInput ? "" : t("auth.verify")}
            </Button>
          </Stack>
        </Stack>
      </form>
      <LanguageToggle />
    </AuthComp>
  );
};

export default VerificationQuestionsPage;
