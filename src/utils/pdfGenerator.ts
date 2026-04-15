import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "./helpers";
// import Logo from "../../src/assets/logo.jpg";

export const generatePDFReceipt = async (
  rawData: any,
  t: any,
  language: any,
) => {
  const citizenInfo = JSON.parse(localStorage.getItem("citizenInfo") || "{}");
  console.log(citizenInfo);
  const citizen = citizenInfo || {};
  const applications = rawData || [];
  console.log("rawDataaaa", rawData);
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
        citizen?.whatsapp_number || "-"
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
          ${formatDate(new Date(citizen.updated_at))}
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
            <p><strong>${t("success.trackingNumber")}:</strong> ${
              app.report_code
            }</p>
            <p><strong>${t("form.submissionDate")}:</strong>
              ${formatDate(new Date(app.created_at))}
            </p>
            <p><strong>${t("status")}:</strong>
              ${t(`status.${app.status?.toLowerCase()}`)}
            </p>
            <p><strong>${t("map.address")}:</strong>
              ${app.address || "-"}
            </p>
          </div>
        `,
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
      (page + 1) * itemsPerPage,
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
            <p><strong>${t("success.trackingNumber")}:</strong> ${app.report_code}</p>
            <p><strong>${t("form.submissionDate")}:</strong>
              ${formatDate(new Date(app.created_at))}
            </p>
            <p><strong>${t("status")}:</strong>
              ${t(`status.${app.status?.toLowerCase()}`)}
            </p>
            <p><strong>${t("map.address")}:</strong>
              ${app.address || "-"}
            </p>
          </div>
        `,
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

export const generateApplicationPDF = async (
  application: any,
  t: any,
  language: string,
) => {
  // نوع المبنى وبياناته
  const buildingType = application?.damage_details?.buildingType;
  const buildingData = buildingType
    ? application?.damage_details?.[buildingType]
    : null;
  const damageAttachments = application?.damageAttachments;

  const groupedAttachments = damageAttachments?.reduce(
    (acc: any, file: any) => {
      const category = file.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(file.file_url);

      return acc;
    },
    {},
  );

  const categoryTitles: any = {
    before_damage_image: `${t("form.before_damage_image")} :`,
    after_damage_image: `${t("form.after_damage_image")} :`,
    ownership_documents: `${t("form.ownership_documents")} :`,
  };

  console.log("applicationData", application);
  const citizen = JSON.parse(localStorage.getItem("citizenInfo") || "{}");

  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const align = isArabic ? "right" : "left";

  // إنشاء PDF
  const pdf = new jsPDF("p", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  // const pageHeight = pdf.internal.pageSize.getHeight();

  // دالة لتحويل بيانات المبنى إلى HTML
  const renderBuildingData = (data: any) => {
    if (!data || typeof data !== "object") return "";

    const direction = language === "ar" ? "rtl" : "ltr";

    const mixedUsageUnits: any = {};
    const mixedUsageFloors: any = {};

    const entries = Object.entries(data).filter(([key, value]) => {
      if (key.startsWith("MixedUsage_floors_")) {
        const floor = key.replace("MixedUsage_floors_", "");
        mixedUsageFloors[floor] = value;
        return false;
      }
      if (key.startsWith("MixedUsage_units_")) {
        const floor = key.replace("MixedUsage_units_", "");
        mixedUsageUnits[floor] = value;
        return false;
      }
      if (key === "MixedUsage") return false;
      if (key === "landmark") return false;

      return (
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      );
    });

    let html = `
  <div style="
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:15px;
    direction:${direction};
  ">`;

    entries.forEach(([key, value]: any) => {
      const translationKey = `form.${key}`;
      const label =
        t(translationKey) !== translationKey ? t(translationKey) : key;

      let displayValue: any = value;

      // boolean
      if (typeof value === "boolean") {
        displayValue = value ? "نعم" : "لا";
      }
      // array
      else if (Array.isArray(value)) {
        displayValue = value.join(" , ");
      }

      html += `
      <div style="margin:0;">
        <strong>${label}:</strong> ${displayValue}
      </div>
    `;
    });

    // ⭐ عرض بيانات الاستخدام المزدوج بشكل مجمع
    if (Object.keys(mixedUsageFloors).length > 0) {
      const floorsSummary = Object.entries(mixedUsageFloors)
        .filter(([_, checked]) => checked)
        .map(([floor, _]) => {
          const units = mixedUsageUnits[floor] || [];
          const unitsSummary = units
            .map(
              (u: any) => `${u.usage}${u.activity ? ` - ${u.activity}` : ""}`,
            )
            .join(" , ");
          return `<strong>${t(`floors.${floor}`)}:</strong> ${unitsSummary || "لا يوجد وحدات"}`;
        })
        .join("<br/>");

      if (floorsSummary) {
        html += `
        <div style="grid-column: span 2; margin-top:10px; padding:10px; background:#f0f7ff; border-radius:8px;">
          <strong>${t("form.MixedUsage")}:</strong><br/>
          ${floorsSummary}
        </div>
      `;
      }
    }

    html += "</div>";

    return html;
  };

  // =============== الصفحة الأولى: الشعار في الرأس + المحتوى في المنتصف ===============
  const firstPageElement = document.createElement("div");
  firstPageElement.style.width = "800px";
  firstPageElement.style.height = "1000px"; // ارتفاع ثابت بحجم صفحة A4
  firstPageElement.style.fontFamily = "'Amiri', Arial, sans-serif";
  firstPageElement.style.padding = "40px";
  firstPageElement.style.background = "#fdfdfd";
  firstPageElement.style.color = "#333";
  firstPageElement.style.lineHeight = "1.8";
  firstPageElement.style.display = "flex";
  firstPageElement.style.flexDirection = "column";
  firstPageElement.style.direction = direction;
  firstPageElement.style.textAlign = align;

  firstPageElement.innerHTML = `
    <!-- الشعار في الرأس (الجزء العلوي) -->
    <div style="
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:40px;
    ">
      <!-- LOGO -->
      <img
        src="$https://res.cloudinary.com/dopcli6un/image/upload/v1774209427/logo_dyktvp.png"
        alt="Logo"
        style="
          height:70px;
          object-fit:contain;
        "
      />

      <!-- TITLES -->
      <div style="text-align:center; flex:1;">
        <h1 style="margin:0; font-size:28px; color:#1E3A8A;">
          ${t("app.title")}
        </h1>
        <p style="font-size:20px; font-weight:bold; margin:5px 0 0;">
          ${t("common.damageRequest")}
        </p>
      </div>

      <!-- EMPTY SPACE (للتوازن) -->
      <div style="width:70px;"></div>
    </div>

    <hr style="margin-bottom:30px;" />

    <!-- المحتوى في المنتصف -->
    <div style="
      flex:1;
      display:flex;
      flex-direction:column;
      justify-content:center;
      gap:75px;
    ">
      <section>
        <h3 style="font-size:25px; color:#1E3A8A;">
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
          citizen?.whatsapp_number || "-"
        }</p>
      </section>

      <section style="margin-top:30px;">
        <h3 style="font-size:25px; color:#1E3A8A;">
          ${t("review.damageInfo")}
        </h3>

        <div style="
          margin-top:15px;
          padding:20px;
          border-radius:12px;
          background:#EFF6FF;
          border-right:6px solid #1E3A8A;
        ">
          <h4>
            <strong>${t("success.trackingNumber")}:</strong> #${application.report_code}
          </h4>

          <p><strong>${t("form.submissionDate")}:</strong> ${formatDate(
            new Date(application.created_at),
          )}</p>
          <p><strong>${t("status")}:</strong> ${t(
            `status.${application.status?.toLowerCase()}`,
          )}</p>
          <p><strong>${t("map.address")}:</strong>
            ${
              [
                application?.location?.neighborhood,
                buildingData?.landmark,
                buildingData?.nameOfStreet,
                buildingData?.buildingNumber,
              ]
                .filter(Boolean)
                .join(" - ") || "-"
            }
          </p>

          <hr style="margin:12px 0; border:none; border-top:1px solid #D1D5DB;" />
          <p style="margin:6px 0;">
            <strong>${t("form.buildingType")}:</strong> ${t(
              `form.${buildingType}`,
            )}
          </p>
        </div>
      </section>
    </div>
  `;

  document.body.appendChild(firstPageElement);
  const canvasFirst = await html2canvas(firstPageElement, { scale: 2 });
  const imgFirst = canvasFirst.toDataURL("image/jpeg");
  const propsFirst = pdf.getImageProperties(imgFirst);
  const heightFirst = (propsFirst.height * pageWidth) / propsFirst.width;

  // إضافة الصورة إلى PDF
  pdf.addImage(imgFirst, "JPEG", 0, 0, pageWidth, heightFirst);
  document.body.removeChild(firstPageElement);

  // =============== الصفحة الثانية: باقي بيانات المبنى ===============
  if (buildingData && Object.keys(buildingData).length > 0) {
    // استخراج البيانات التي تريد عرضها في الصفحة الثانية (كل شيء ما عدا نوع المبنى)
    const { buildingType: _, ...restOfData } = buildingData;

    const secondPageElement = document.createElement("div");
    secondPageElement.style.width = "800px";
    secondPageElement.style.fontFamily = "'Amiri', Arial, sans-serif";
    secondPageElement.style.direction = language === "en" ? "ltr" : "rtl";
    secondPageElement.style.padding = "40px";
    secondPageElement.style.background = "#fdfdfd";
    secondPageElement.style.color = "#333";
    secondPageElement.style.lineHeight = "1.8";
    secondPageElement.style.direction = direction;
    secondPageElement.style.textAlign = align;

    secondPageElement.innerHTML = `
      <h3 style="font-size:25px; color:#1E3A8A; margin-bottom:20px;">
        ${t("form.buildingDetails")}
      </h3>

      <div style="
        padding:20px;
        border-radius:12px;
        background:#EFF6FF;
        border-right:6px solid #1E3A8A;
      ">
        ${renderBuildingData(restOfData)}
      </div>
    `;

    document.body.appendChild(secondPageElement);
    const canvasSecond = await html2canvas(secondPageElement, { scale: 2 });
    const imgSecond = canvasSecond.toDataURL("image/jpeg");
    const propsSecond = pdf.getImageProperties(imgSecond);
    const heightSecond = (propsSecond.height * pageWidth) / propsSecond.width;

    pdf.addPage();
    pdf.addImage(imgSecond, "JPEG", 0, 0, pageWidth, heightSecond);
    document.body.removeChild(secondPageElement);
  }

  if (groupedAttachments && Object.keys(groupedAttachments).length > 0) {
    const imagesPage = document.createElement("div");

    imagesPage.style.width = "800px";
    imagesPage.style.padding = "40px";
    imagesPage.style.fontFamily = "'Amiri', Arial, sans-serif";
    imagesPage.style.direction = language === "en" ? "ltr" : "rtl";
    imagesPage.style.background = "#fff";

    let html = ``;

    Object.entries(groupedAttachments).forEach(([category, images]: any) => {
      html += `
      <div style="margin-bottom:40px;">
        <h3 style="margin-bottom:10px; color:#333;">
          ${categoryTitles[category] || category}
        </h3>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          ${images
            .map(
              (url: string) => `
                <div style="page-break-inside: avoid;">
                  <img
                    src="${url}"
                    style="
                      width:100%;
                      height:220px;
                      object-fit:cover;
                      border-radius:8px;
                      border:1px solid #ddd;
                    "
                  />
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    `;
    });

    imagesPage.innerHTML = html;

    document.body.appendChild(imagesPage);

    const canvas = await html2canvas(imagesPage, {
      scale: 2,
      useCORS: true, // مهم جداً للـ S3 images
    });

    const img = canvas.toDataURL("image/jpeg", 1.0);
    const imgProps = pdf.getImageProperties(img);

    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addPage();

    while (heightLeft > 0) {
      pdf.addImage(img, "JPEG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= 1000;
      position -= 1000;

      if (heightLeft > 0) pdf.addPage();
    }

    document.body.removeChild(imagesPage);
  }

  // =============== حفظ الملف ===============
  pdf.save(`Application-${application.id}.pdf`);
};
