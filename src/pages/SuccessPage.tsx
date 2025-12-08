import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { CheckCircle, Download, Eye, Copy } from "lucide-react";
import { generatePDFReceipt } from "../utils/pdfGenerator";
import { axiosClient } from "../api/baseUrl";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // const { data } = useApplicationStore();
  const [copied, setCopied] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    if (data?.id) {
      generatePDFReceipt(data);
    }
  };

  useEffect(() => {
    const fetchApplication = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axiosClient.get("/applications/my-application", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data.data);
        if (res.data.data) {
          const trackingNumber = res.data.data.id;
          const data = res.data.data;
          setTrackingNumber(trackingNumber);
          setData(data);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, []);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("success.title")}
        </h1>

        <div className="space-y-6 mt-8">
          {/* Tracking Number */}
          <div className="bg-gray-50 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("success.trackingNumber")}
            </label>
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                </div>
                <span className="text-sm text-gray-500">
                  {t("common.loading")}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-primary">
                  {trackingNumber}
                </p>
                <button
                  onClick={() => handleCopy(trackingNumber || "")}
                  className="text-gray-600 hover:text-primary"
                  title="Copy"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {copied && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg">
              Copied to clipboard!
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleDownloadReceipt}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t("success.downloadReceipt")}
            </button>
            <button
              onClick={() => navigate("/track-status")}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              {t("success.trackStatus")}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>
                You will receive SMS notifications about your application status
              </li>
              <li>Save your tracking number and password securely</li>
              <li>
                You can track your application status using the tracking number
              </li>
              <li>Contact support if you have any questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
