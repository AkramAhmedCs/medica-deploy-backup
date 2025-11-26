import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export const generateMedicalHistoryPDF = (patientName, doctorName, history) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(54, 196, 212); // Primary color
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MEDICA", 20, 25);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Medical Appointment System", 20, 33);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Patient Info
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Medical History Report", 20, 55);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Patient: ${patientName}`, 20, 65);
  doc.text(`Doctor: ${doctorName}`, 20, 72);
  doc.text(`Generated: ${format(new Date(), "PPP")}`, 20, 79);

  // Table
  const tableData = history.map((record) => [
    format(new Date(record.visitDate), "PP"),
    record.prescription || "No prescription",
  ]);

  doc.autoTable({
    startY: 90,
    head: [["Visit Date", "Prescription"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [54, 196, 212],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save
  doc.save(`medical-history-${patientName.replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const generateAppointmentReceiptPDF = (appointment, patientName, doctorName) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(54, 196, 212);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MEDICA", 20, 25);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Appointment Receipt", 20, 33);

  doc.setTextColor(0, 0, 0);

  // Receipt Details
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Appointment Confirmation", 20, 55);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const details = [
    ["Patient:", patientName],
    ["Doctor:", doctorName],
    ["Date & Time:", format(new Date(appointment.appointmentDate), "PPpp")],
    ["Status:", appointment.status],
    ["Booking ID:", `#${appointment.id}`],
  ];

  let yPos = 70;
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 70, yPos);
    yPos += 8;
  });

  // Important Notice
  doc.setFillColor(220, 227, 230);
  doc.rect(15, yPos + 10, 180, 40, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Important Information:", 20, yPos + 20);

  doc.setFont("helvetica", "normal");
  doc.text("• Please arrive 15 minutes before your appointment", 20, yPos + 28);
  doc.text("• Bring your ID and insurance card", 20, yPos + 35);
  doc.text("• Cancel at least 24 hours in advance if needed", 20, yPos + 42);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${format(new Date(), "PPP")}`,
    doc.internal.pageSize.width / 2,
    doc.internal.pageSize.height - 10,
    { align: "center" }
  );

  doc.save(`appointment-receipt-${appointment.id}.pdf`);
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
