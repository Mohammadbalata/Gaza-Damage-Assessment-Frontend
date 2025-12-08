import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "../contexts/LanguageContext";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileCheck,
} from "lucide-react";
import { axiosClient } from "../api/baseUrl";

interface FormData {
  trackingNumber: string;
}

interface StatusHistory {
  status: string;
  timestamp: string;
}

const TrackStatusPage = () => {
  const { t } = useLanguage();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(
        `/track-application/${data.trackingNumber}`
      );

      if (res) {
        const app = res.data.data;
        setApplication({
          trackingNumber: app.id,
          status: app.status,
          submittedAt: app.createdAt,
          lastUpdate: app.updatedAt,
          statusHistory: [
            { status: app.status, timestamp: app.createdAt },
            { status: app.status, timestamp: app.createdAt },
          ],
        });
      }
    } catch (err: any) {
      setError(err.response.data.message);
      console.log(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      case "underReview":
        return <FileCheck className="w-5 h-5 text-yellow-600" />;
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return null;

    const statusClass = `badge badge-${status
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()}`;

    return <span className={statusClass}>{t(`${status}`)}</span>;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t("auth.trackStatus")}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="trackingNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("success.trackingNumber")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="trackingNumber"
              type="text"
              {...register("trackingNumber", {
                required: t("common.required"),
                pattern: {
                  value: /^GAZA-\d{4}-\d{6}$/,
                  message: "Invalid tracking number format (GAZA-YYYY-XXXXXX)",
                },
              })}
              placeholder="GAZA-2024-123456"
              className="input-field"
            />
            {errors.trackingNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.trackingNumber.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? t("common.loading") : "Track Status"}
          </button>
        </form>
        {error ? (
          <p className="text-center mt-1 text-md text-red-600">{error}</p>
        ) : (
          <>
            {application && (
              <div className="mt-8 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Application Status
                    </h3>
                    {getStatusBadge(application.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Tracking Number:{" "}
                    <span className="font-mono font-bold">
                      {application.trackingNumber}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Last Updated:{" "}
                    {new Date(application.lastUpdate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Status Timeline
                  </h3>
                  <div className="space-y-4">
                    {application.statusHistory?.map(
                      (history: StatusHistory, index: number) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="mt-1">
                            {getStatusIcon(history.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">
                                {t(`${history.status}`)}
                              </p>
                              {index ===
                                application.statusHistory.length - 1 && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(history.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrackStatusPage;
