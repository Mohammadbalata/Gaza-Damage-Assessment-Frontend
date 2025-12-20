import classNames from "classnames";
import { FileText, MapPin, Edit } from "lucide-react";
import FormDialog from "./FormDialog";
import { useState } from "react";
import { Dialog } from "@mui/material";
import DamageAssessmentDialog from "../pages/DamageAssessmentDialog";

type ApplicationStatusType =
  | "pending"
  | "verified"
  | "approved"
  | "rejected"
  | "closed";

interface RequestStatusBadgeProps {
  status: ApplicationStatusType;
}

interface Location {
  id: number;
  address: string;
}

interface MyApplicationProps {
  id: string;
  locations: Location[];
  status: ApplicationStatusType;
  createdAt: string;
}

const ApplicationStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  const labelMap: Record<ApplicationStatusType, string> = {
    pending: "قيد المراجعة",
    verified: "تم التحقق",
    approved: "مقبول",
    rejected: "مرفوض",
    closed: "مغلق",
  };

  const badgeColor: Record<ApplicationStatusType, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    verified: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    closed: "bg-gray-200 text-gray-600",
  };

  return (
    <span
      className={classNames(
        "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap",
        badgeColor[status]
      )}
    >
      {labelMap[status]}
    </span>
  );
};

interface RequestLocationProps {
  location: string;
}

const RequestLocation = ({ location }: RequestLocationProps) => (
  <div className="flex items-center gap-2 text-gray-600 mt-1">
    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
    <span className="break-words whitespace-normal">{location}</span>
  </div>
);

const MyApplication = ({ id, locations, status, createdAt }: myApplication) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [applications, setApplications] = useState([]);

  const handleEditApplication = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
    console.log(id);
  };

  const ApplicationStatus = (status: ApplicationStatusType, id: number) => {
    switch (status) {
      case "pending":
        return (
          <Edit
            onClick={() => handleEditApplication(id)}
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          />
        );
      case "verified":
        return <p className="text-green-600">تمت الموافقة ✅</p>;
      case "approved":
        return <p className="text-green-600">تمت الموافقة ✅</p>;
      case "rejected":
        return <p className="text-red-600">مرفوض ❌</p>;
      case "closed":
        return <p className="text-gray-500">مغلق</p>;
      default:
        return;
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">طلباتي</h1>

      <div className="space-y-4">
        {locations?.map((app: any) => (
          <div
            key={app.id}
            className="break-words p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ">
              {/* الجانب الأيسر: معلومات الطلب */}
              <div className="flex flex-col gap-1 w-full sm:w-3/4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-800">{id}</span>
                </div>

                <span className="text-sm text-gray-500">
                  تاريخ الطلب: {new Date(createdAt).toLocaleDateString("ar-EG")}
                </span>

                <RequestLocation location={app?.address} />
              </div>

              {/* الجانب الأيمن: حالة الطلب */}
              <div className="flex items-center gap-2 ">
                <ApplicationStatusBadge status={status} />
                {ApplicationStatus(status, app.id)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {openDialog && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DamageAssessmentDialog
            {...{ setApplications }}
            onClose={() => setOpenDialog(false)}
          />
        </Dialog>
      )}
    </div>
  );
};

export default MyApplication;
