import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "./helpers";

export const generatePDFReceipt = async (data: any, t: any, language: any) => {
  const citizen = data?.citizen;
  const applications = data?.applications || [];

  // const previousApplications = applications.filter(
  //   (app: any) => app.location?.type === "BEFORE_WAR"
  // );

  // ⭐ تقسيم الطلبات
  const firstPageApplications = applications?.slice(0, 2);
  const remainingApplications = applications?.slice(2);

  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const itemsPerPage = 4;

  // ================= الصفحة الأولى =================
  const firstPageElement = document.createElement("div");
  firstPageElement.style.width = "800px";
  firstPageElement.style.fontFamily = "'Amiri', Arial, sans-serif";
  firstPageElement.style.direction = language === "en" ? "ltr" : "rtl";
  firstPageElement.style.padding = "40px";
  firstPageElement.style.background = "#fdfdfd";
  firstPageElement.style.color = "#333";
  firstPageElement.style.lineHeight = "1.8";
  firstPageElement.style.boxSizing = "border-box";

  firstPageElement.innerHTML = `
    <div style="text-align:center; margin-bottom:30px;">
      <h1 style="margin:0; font-size:28px; color:#1E3A8A; font-weight:bold;">
        ${t("app.title")}
      </h1>
      <p style="margin:5px 0; font-size:20px; color:#374151; font-weight:bold;">
        ${t("app.receipt")}
      </p>
    </div>

    <hr style="border:none; border-top:2px solid #eee; margin-bottom:30px;" />

    <section style="margin-bottom:30px;">
      <h3 style="font-size:25px; color:#1E3A8A; font-weight:bold; margin-bottom:15px;">
        ${t("review.identityInfo")}
      </h3>
      <p><strong>${t("auth.nationalId")}:</strong> ${
    citizen?.national_id || "-"
  }</p>
      <p><strong>${t("form.fullName")}:</strong> ${
    citizen?.full_name || "-"
  }</p>
      <p><strong>${t("auth.email")}:</strong> ${citizen?.email || "-"}</p>
      <p><strong>${t("form.phoneNumber")}:</strong> ${
    citizen?.phone_number || "-"
  }</p>
    </section>

    ${
      citizen?.current_location
        ? `
      <section style="
        padding:20px;
        border-radius:12px;
        background:#ECFDF5;
        box-shadow:0 4px 8px rgba(0,0,0,0.04);
        border-right:6px solid #10B981;
      ">
        <h3 style="font-size:25px; color:#047857; font-weight:bold; margin-bottom:15px;">
          ${t("citizen.currentLocation")}
        </h3>
        <p><strong>${t("map.address")}:</strong> ${
            citizen.current_location.address || "-"
          }</p>
        <p><strong>${t("form.submissionDate")}:</strong>
          ${formatDate(new Date(citizen.current_location.createdAt))}
        </p>
      </section>
    `
        : ""
    }

    ${
      firstPageApplications.length
        ? `
      <section ">
        <h3 style="font-size:25px; color:#1E3A8A; font-weight:bold; margin-bottom:20px;">
          ${t("citizen.myRequests")}
        </h3>

        ${firstPageApplications
          .map(
            (app: any, index: number) => `
          <div style="
            margin-bottom:20px;
            padding:20px;
            border-radius:12px;
            background:#EFF6FF;
            box-shadow:0 4px 8px rgba(0,0,0,0.05);
            border-right:6px solid #1E3A8A;
          ">
            <h4 style="margin-top:0; color:#1E3A8A;">
              ${t("citizen.applicationId")} ${index + 1}
            </h4>
            <p><strong>${t("success.trackingNumber")}:</strong> ${app.id}</p>
            <p><strong>${t("form.submissionDate")}:</strong>
              ${formatDate(new Date(app.createdAt))}
            </p>
            <p><strong>${t("status")}:</strong>
              ${t(`status.${app.status?.toLowerCase()}`)}
            </p>
            <p><strong>${t("map.address")}:</strong>
              ${app.location?.address || "-"}
            </p>
          </div>
        `
          )
          .join("")}
      </section>
    `
        : ""
    }
  `;

  document.body.appendChild(firstPageElement);
  const canvasFirst = await html2canvas(firstPageElement, { scale: 2 });
  const imgFirst = canvasFirst.toDataURL("image/jpeg");
  const propsFirst = pdf.getImageProperties(imgFirst);
  const heightFirst = (propsFirst.height * pageWidth) / propsFirst.width;
  pdf.addImage(imgFirst, "JPEG", 0, 0, pageWidth, heightFirst);
  document.body.removeChild(firstPageElement);

  // ================= الصفحات التالية =================
  const totalPages = Math.ceil(remainingApplications.length / itemsPerPage);

  for (let page = 0; page < totalPages; page++) {
    const pageApps = remainingApplications.slice(
      page * itemsPerPage,
      (page + 1) * itemsPerPage
    );

    const pageElement = document.createElement("div");
    pageElement.style.width = "800px";
    pageElement.style.fontFamily = "'Amiri', Arial, sans-serif";
    pageElement.style.direction = language === "en" ? "ltr" : "rtl";
    pageElement.style.padding = "40px";
    pageElement.style.background = "#fdfdfd";
    pageElement.style.color = "#333";
    pageElement.style.lineHeight = "1.8";

    pageElement.innerHTML = `
      <section>
        ${pageApps
          .map(
            (app: any, index: number) => `
          <div style="
            margin-bottom:20px;
            padding:20px;
            border-radius:12px;
            background:#EFF6FF;
            box-shadow:0 4px 8px rgba(0,0,0,0.05);
            border-right:6px solid #1E3A8A;
          ">
            <h4 style="margin-top:0; color:#1E3A8A;">
              ${t("citizen.applicationId")}
              ${page * itemsPerPage + index + 3}
            </h4>
            <p><strong>${t("success.trackingNumber")}:</strong> ${app.id}</p>
            <p><strong>${t("form.submissionDate")}:</strong>
              ${formatDate(new Date(app.createdAt))}
            </p>
            <p><strong>${t("status")}:</strong>
              ${t(`status.${app.status?.toLowerCase()}`)}
            </p>
            <p><strong>${t("map.address")}:</strong>
              ${app.location?.address || "-"}
            </p>
          </div>
        `
          )
          .join("")}
      </section>
    `;

    document.body.appendChild(pageElement);
    const canvas = await html2canvas(pageElement, { scale: 2 });
    const img = canvas.toDataURL("image/jpeg");
    const props = pdf.getImageProperties(img);
    const height = (props.height * pageWidth) / props.width;

    pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, pageWidth, height);
    document.body.removeChild(pageElement);
  }

  // ================= حفظ الملف =================
  pdf.save(`Application-Receipt-${citizen?.national_id}.pdf`);
};
