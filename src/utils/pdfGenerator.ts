import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "./helpers";

export const generatePDFReceipt = async (data: any, t: any) => {
  const buildingType = data.extraData.buildingType;
  const buildingData = data.extraData?.[buildingType] || {};

  // إنشاء عنصر HTML مؤقت
  const element = document.createElement("div");
  element.style.width = "800px";
  element.style.fontFamily = "'Amiri', 'Arial', sans-serif";
  element.style.direction = "rtl"; // دعم اللغة العربية
  element.style.padding = "30px";
  element.style.background = "#fff";
  element.style.color = "#333";
  element.style.lineHeight = "1.6";
  element.style.border = "1px solid #ddd";
  element.style.borderRadius = "8px";
  // success.trackingNumber
  element.innerHTML = `
    <div style="text-align:center; margin-bottom: 20px;">
      <h1 style="margin:0; font-size:24px; font-weight:bold;">${t(
        "app.title"
      )}</h1>
      <h2 style="margin:5px 0 0 0; font-size:18px; font-weight:normal;">${t(
        "app.subtitle"
      )}</h2>
      <p style="margin:10px 0 0 0; font-size:16px;">${t("app.receipt")}</p>
    </div>
    <hr style="margin:20px 0; border:none; border-top:1px solid #ccc;" />

    <section style="margin-bottom:20px;">
      <h3 style="font-size:18px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
        ${t("review.identityInfo")}
      </h3>
      <p><strong>${t("auth.nationalId")}:</strong> ${
    data.citizen.national_id || "N/A"
  }</p>
        <p><strong>${t("success.trackingNumber")}:</strong> ${
    data.id || "N/A"
  }</p>
      <p><strong>${t("form.fullName")}:</strong> ${
    data.citizen.full_name || "N/A"
  }</p>
      <p><strong>${t("form.submissionDate")}:</strong> ${formatDate(
    new Date(data.createdAt)
  )}</p>
    </section>

    <section style="margin-bottom:20px;">
      <h3 style="font-size:18px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
        ${t("review.damageInfo")}
      </h3>

            <p><strong>${t("form.propertyType")}:</strong> ${
    buildingType || "N/A"
  }</p>

      <p><strong>${t("form.damageLevel")}:</strong> ${
    buildingData.damageType || "N/A"
  }</p>

      <p><strong>${t("form.propertySize")}:</strong> ${
    buildingData.propertyArea ?? 0
  } متر مربع</p>
      <p><strong>${t("form.isInhabitable")}:</strong> ${
    buildingData.isHabitable ? t("form.yes") : t("form.no")
  }</p>
    </section>

    <section style="margin-bottom:20px;">
      <h3 style="font-size:18px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
        ${t("location.previous")}
      </h3>
      <p><strong>${t("map.address")}:</strong> ${
    data.locations[0]?.governorate || "N/A"
  }</p>
    </section>

    <section style="margin-bottom:20px;">
      <h3 style="font-size:18px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
        ${t("location.current")}
      </h3>
      <p><strong>${t("map.address")}:</strong> ${
    data.locations[1]?.governorate || "N/A"
  }</p>
    </section>

    <section style="margin-top:20px;">
      <h3 style="font-size:18px; margin-bottom:10px; border-bottom:1px solid #ddd; padding-bottom:5px;">
        ${t("review.instructions")}
      </h3>
      <ul style="padding-right: 20px; margin:0; list-style-type: none;">
        <li>حافظ على هذا الإيصال ورقم التتبع بأمان</li>
        <li>قم بحفظ كلمة المرور بشكل آمن</li>
        <li>ستتلقى تحديثات عبر الرسائل القصيرة</li>
        <li>هذا مستند رسمي صادر عن الحكومة</li>
      </ul>
    </section>
  `;

  document.body.appendChild(element);

  // تحويل HTML إلى canvas
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/jpeg");

  // إنشاء PDF وإضافة الصورة
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pageWidth - 40;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
  pdf.save(`Application-Receipt-${data.id || "N/A"}.pdf`);

  document.body.removeChild(element);
};
