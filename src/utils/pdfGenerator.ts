import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "./helpers";

export const generatePDFReceipt = async (data: any, t: any) => {
  const citizen = data.citizen;
  const locations = data.locations || [];

  const previousLocations = locations.filter(
    (l: any) => l.type === "before_war"
  );
  const currentLocation = locations.find(
    (l: any) => l.type === "current"
  );

  const element = document.createElement("div");
  element.style.width = "800px";
  element.style.fontFamily = "'Amiri', Arial, sans-serif";
  element.style.direction = "rtl";
  element.style.padding = "30px";
  element.style.background = "#fff";
  element.style.color = "#333";
  element.style.lineHeight = "1.8";

  element.innerHTML = `
    <div style="text-align:center; margin-bottom:20px;">
      <h1 style="margin:0;">${t("app.title")}</h1>
      <p>${t("app.receipt")}</p>
    </div>

    <hr />

    <!-- بيانات الهوية -->
    <section>
      <h3>${t("review.identityInfo")}</h3>
      <p><strong>${t("auth.nationalId")}:</strong> ${citizen?.national_id || "-"}</p>
      <p><strong>${t("form.fullName")}:</strong> ${citizen?.full_name || "-"}</p>
      <p><strong>البريد الإلكتروني:</strong> ${citizen?.email || "-"}</p>
      <p><strong>رقم الموبايل:</strong> ${citizen?.phone_number || "-"}</p>
      <p><strong>${t("success.trackingNumber")}:</strong> ${data.id}</p>
      <p><strong>${t("form.submissionDate")}:</strong> ${formatDate(new Date(data.createdAt))}</p>
    </section>

    <hr />

    <!-- السكن السابق -->
    <section>
      <h3>السكن السابق (قبل الحرب)</h3>
      ${
        previousLocations.length
          ? previousLocations
              .map((loc: any, index: number) => {
                const extraData = JSON.parse(loc.extraData || "{}");
                const buildingType = extraData.buildingType;
                const building = extraData?.[buildingType] || {};

                return `
                  <div style="margin-bottom:15px; padding-bottom:10px; border-bottom:1px dashed #ccc;">
                    <p><strong>الممتلك ${index + 1}</strong></p>
                    <p><strong>${t("map.address")}:</strong> ${loc.address || "-"}</p>
                    <p><strong>${t("form.damageLevel")}:</strong> ${building.damageType || "-"}</p>
                    <p><strong>${t("form.propertyType")}:</strong> ${building.propertyType || "-"}</p>
                    <p><strong>${t("form.propertySize")}:</strong> ${
                      building.propertyArea ?? 0
                    } متر مربع</p>
                    <p><strong>${t("form.isInhabitable")}:</strong> ${
                      building.isHabitable ? t("form.yes") : t("form.no")
                    }</p>
                  </div>
                `;
              })
              .join("")
          : "<p>لا يوجد سكن سابق</p>"
      }
    </section>

    <hr />

    <!-- السكن الحالي -->
    <section>
      <h3>السكن الحالي</h3>
      <p><strong>${t("map.address")}:</strong> ${
        currentLocation?.address || "-"
      }</p>
    </section>

    <hr />

    <section>
      <p style="font-size:12px; color:#666;">
        هذا إيصال رسمي، يرجى الاحتفاظ به ورقم التتبع لاستخدامه لاحقاً.
      </p>
    </section>
  `;

  document.body.appendChild(element);

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/jpeg");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pdfWidth = pageWidth - 40;
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "JPEG", 20, 20, pdfWidth, pdfHeight);
  pdf.save(`Application-Receipt-${data.id}.pdf`);

  document.body.removeChild(element);
};
