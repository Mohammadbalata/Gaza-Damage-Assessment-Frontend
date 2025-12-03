import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

import { AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import { ROUTES } from "../routes/Routes";
import { signUp } from "../redux/slices/authSlice";
import { axiosClient } from "../api/baseUrl";
import Button from "../components/Shared/Button/Button";

interface FormData {
  [key: string]: string;
}

const VerificationQuestionsPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id");

  const {
    nationalId,
    verificationQuestion,
    loading: loadingStore,
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(loadingStore);
  const [loadingInput, setLoadingInput] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (verificationQuestion.length === 0) {
      setLoading(true);
      dispatch(signUp({ nationalId: id, password: "" }))
        .unwrap()
        .then(() => {})
        .catch(() => {
          navigate(`/${ROUTES.SIGNUP}`);
        });
    } else {
      setQuestions(verificationQuestion);
      setLoading(loadingStore);
    }
  }, [verificationQuestion]);

  const onSubmit = async (formData: FormData) => {
    setLoadingInput(true);
    let answers: { [key: string]: string } = {};
    for (let key in formData) {
      if (formData[key] !== "") {
        answers[key] = formData[key];
      }
    }
    await axiosClient
      .post("/auth/verify-questions", {
        nationalId: nationalId,
        answers: answers,
      })
      .then(() => {
        setLoadingInput(false);
        navigate(`${ROUTES.PASSWORD_DISPLAY}`);
        console.log("success");
      })
      .catch((error: any) => {
        console.log(error.response.data.message);
        setLoadingInput(false);
        setError(error.response.data.message);
      });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0 && loading === false) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">
            National ID not found in civil registry
          </p>
          <button
            onClick={() => {
              navigate(`/${ROUTES.SIGNUP}`);
            }}
            className="btn-primary mt-4"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {t("auth.verifyQuesTitle")}
          </h2>
          <p className="text-gray-600">{t("auth.verifyQuesBody")}</p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {index + 1}.{" "}
                {/* {language === "ar" ? question.questionAr : question.question} */}
                {question.question}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                {...register(question.key, {
                  required: t("common.required"),
                })}
                className="input-field"
                placeholder={
                  language === "ar" ? "أدخل الإجابة" : "Enter your answer"
                }
              />
              {errors[question.key] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[question.id]?.message as string}
                </p>
              )}
            </div>
          ))}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                navigate(`/${ROUTES.SIGNUP}`);
              }}
              className="btn-outline flex-1"
            >
              {t("common.back")}
            </button>
            <Button
              type="submit"
              className="btn-primary flex-1"
              label={
                loadingInput ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t("common.loading")}
                  </div>
                ) : (
                  t("auth.verify")
                )
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationQuestionsPage;
