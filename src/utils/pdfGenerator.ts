import jsPDF from "jspdf";
import { formatDate } from "./helpers";

// interface ApplicationData {
//   trackingNumber?: string;
//   nationalId?: string;
//   fullName?: string;
//   motherName?: string;
//   dateOfBirth?: string;
//   phoneNumber?: string;
//   addressBeforeWar?: string;
//   propertyType?: string;
//   propertySize?: number;
//   numberOfRooms?: number;
//   damageLevel?: string;
//   isInhabitable?: boolean;
//   wifeName?: string;
//   numberOfChildren?: number;
//   latitude?: number;
//   longitude?: number;
//   password?: string;
// }

export const generatePDFReceipt = (data: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("GAZA DAMAGE ASSESSMENT SYSTEM", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Ministry of Public Works and Housing", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 8;
  doc.text("Official Application Receipt", pageWidth / 2, yPos, {
    align: "center",
  });
  yPos += 15;

  // Line
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Tracking Number
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`TRACKING NUMBER: ${data.id || "N/A"}`, margin, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`SUBMISSION DATE: ${formatDate(new Date())}`, margin, yPos);
  yPos += 15;

  // Applicant Information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("APPLICANT INFORMATION", margin, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Full Name: ${data.citizen.first_name + data.citizen.family_name || "N/A"}`,
    margin,
    yPos
  );
  yPos += 6;
  doc.text(`National ID: ${data.national_id || "N/A"}`, margin, yPos);
  yPos += 6;
  // doc.text(`Date of Birth: ${data.dateOfBirth || "N/A"}`, margin, yPos);
  // yPos += 6;
  // doc.text(`Mother's Name: ${data.motherName || "N/A"}`, margin, yPos);
  // yPos += 6;
  // doc.text(`Phone Number: ${data.phoneNumber || "N/A"}`, margin, yPos);
  // yPos += 10;

  // Property Information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PROPERTY INFORMATION", margin, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Address Before War: ${data.locations[0].governorate || "N/A"}`,
    margin,
    yPos
  );
  yPos += 6;
  doc.text(
    `Current Address : ${data.locations[1].governorate || "N/A"}`,
    margin,
    yPos
  );
  yPos += 6;
  doc.text(`Property Size: ${data.propertySize || 0} sq meters`, margin, yPos);
  yPos += 6;
  doc.text(`Number of Rooms: ${data.numberOfRooms || 0}`, margin, yPos);
  yPos += 6;
  doc.text(
    `Damage Level: ${data.damageLevel?.toUpperCase() || "N/A"}`,
    margin,
    yPos
  );
  yPos += 6;
  doc.text(
    `Currently Inhabitable: ${data.isInhabitable ? "No" : "Yes"}`,
    margin,
    yPos
  );
  yPos += 10;

  // Location
  if (data.latitude && data.longitude) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("LOCATION COORDINATES", margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Latitude: ${data.latitude.toFixed(6)}`, margin, yPos);
    yPos += 6;
    doc.text(`Longitude: ${data.longitude.toFixed(6)}`, margin, yPos);
    yPos += 10;
  }

  // Family Information
  // doc.setFontSize(12);
  // doc.setFont("helvetica", "bold");
  // doc.text("FAMILY INFORMATION", margin, yPos);
  // yPos += 8;
  // doc.setFontSize(10);
  // doc.setFont("helvetica", "normal");
  // doc.text(`Wife's Name: ${data.wifeName || "N/A"}`, margin, yPos);
  // yPos += 6;
  // doc.text(`Number of Children: ${data.numberOfChildren || 0}`, margin, yPos);
  // yPos += 10;

  // Password
  if (data.password) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ACCOUNT CREDENTIALS", margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Password: ${data.password}`, margin, yPos);
    yPos += 10;
  }

  // Footer
  doc.setFontSize(9);
  doc.text("⚠️ IMPORTANT INSTRUCTIONS:", margin, yPos);
  yPos += 6;
  doc.text("- Keep this receipt and tracking number safe", margin, yPos);
  yPos += 6;
  doc.text("- Save your password securely", margin, yPos);
  yPos += 6;
  doc.text("- You will receive SMS updates", margin, yPos);
  yPos += 6;
  doc.text("- This is an official government document", margin, yPos);

  // Save PDF
  const filename = `Application-Receipt-${data.trackingNumber || "N/A"}.pdf`;
  doc.save(filename);
};
