/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pill, FileDown, Send } from "lucide-react";
import AddNewPrescription from "./AddNewPrescription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDiagnosisByAppointmentId,
  getPrescriptionByAppointmentId,
} from "@/api/appointment.api";
import { useParams } from "react-router-dom";
import MedicationItem from "./MedicationItem";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import "./Roboto-Regular-italic";
import useAuthToken from "@/utils/userAuthToken";
import SendPrescriptionModal from "./SendPrescriptionModal";

const doc = new jsPDF();
doc.setFont("Roboto-Regular", "italic");
doc.setFontSize(12);
doc.text("ĐƠN THUỐC - Khám bệnh và kê đơn điều trị", 10, 30);

const PrescriptionSection = ({ booking }) => {

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const auth = useAuthToken();
  const { appointmentId } = useParams();
  const [addPrescriptionOpen, setAddPrescriptionOpen] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");

  const handleAddMedication = () => {
    setAddPrescriptionOpen(true);
  };

  useEffect(() => {
    fetchPrescriptionByAppointmentId();
    fetchDiagnosisData();
  }, [appointmentId]);

  const fetchPrescriptionByAppointmentId = async () => {
    const res = await getPrescriptionByAppointmentId(appointmentId);
    if (res.EC === 0) {
      setPrescription(res.DT);
    }
  };

  const fetchDiagnosisData = async () => {
    const res = await getDiagnosisByAppointmentId(appointmentId);
    if (res.EC === 0) {
      setDiagnosis(res.DT);
    }
  };

  const generatePDF = () => {
    if (!prescription || !prescription.prescription_details) return;

    // 1. Tạo PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 2. Sử dụng font hỗ trợ tiếng Việt
    doc.setFont("Roboto-Regular", "normal");

    // 3. Thêm viền trang và header
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277); // Viền trang

    // Header với logo và tiêu đề
    doc.setFillColor(41, 128, 185);
    doc.rect(10, 10, 190, 25, "F");

    // Tiêu đề chính
    doc.setFont("Roboto-Regular", "italic");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("ĐƠN THUỐC", 105, 25, { align: "center" });

    // 4. Thông tin phòng khám
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("Roboto-Regular", "italic");
    doc.text("THÔNG TIN PHÒNG KHÁM", 20, 45);

    doc.setFont("Roboto-Regular", "italic");
    doc.setFontSize(10);
    doc.text(`Tên đơn vị: ${booking.clinicData.name}`, 20, 52);
    doc.text(`Địa chỉ: ${booking.clinicData.address}`, 20, 57);
    doc.text(`Điện thoại: ${booking.doctorData.userData.phone_number}`, 20, 62);

    // Số đơn thuốc và ngày tháng (góc phải)
    doc.setFont("Roboto-Regular", "italic");
    doc.text(`Số: ${prescription.id}`, 150, 45);
    const today = moment().format("DD/MM/YYYY");
    doc.text(`Ngày: ${today}`, 150, 52);

    // Đường kẻ ngăn cách
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.3);
    doc.line(15, 67, 195, 67);

    // 5. Thông tin bệnh nhân
    doc.setFont("Roboto-Regular", "italic");
    doc.setFontSize(12);
    doc.text("THÔNG TIN BỆNH NHÂN", 20, 75);

    doc.setFont("Roboto-Regular", "italic");
    doc.setFontSize(10);

    doc.text(
      `Họ tên: ${booking?.patientData?.full_name || "Chưa có thông tin"}`,
      20,
      82
    );
    doc.text(
      `Ngày sinh: ${moment(booking?.patientData.dob).format("DD/MM/YYYY")}`,
      20,
      87
    );
    doc.text(`Giới tính: ${booking.patientData.gender}`, 120, 87);
    doc.text(
      `Địa chỉ liên hệ: ${
        booking?.patientData?.address || "Chưa có thông tin"
      }`,
      20,
      92
    );

    // Đường kẻ ngăn cách
    doc.line(15, 97, 195, 97);

    // 6. Chẩn đoán
    doc.setFont("Roboto-Regular", "italic");
    doc.setFontSize(12);
    doc.text("CHẨN ĐOÁN", 20, 105); // đưa lên cao hơn một chút

    doc.setFont("Roboto-Regular", "italic");
    doc.setFontSize(10);

    let y = 110; // bắt đầu từ Y=108
    const lineHeight = 7; // khoảng cách giữa các dòng

    doc.text(
      `${diagnosis?.diagnosis?.diagnosis || "Chưa có thông tin"}`,
      20,
      y
    );
    y += lineHeight;

    // Đường kẻ ngăn cách
    doc.line(15, 132, 195, 132);

    // 7. Bảng thuốc
    doc.setFont("Roboto-Regular", "italic");
    doc.setFontSize(12);
    doc.text("CHỈ ĐỊNH THUỐC", 20, 140);

    const tableData = prescription.prescription_details.map((item, index) => [
      index + 1,
      item.medication_name,
      item.quantity,
      item.unit,
      item.instructions,
    ]);

    autoTable(doc, {
      startY: 145,
      margin: { left: 20, right: 20 },
      head: [["STT", "Tên thuốc", "Số lượng", "Đơn vị", "Cách dùng"]],
      body: tableData,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        font: "Roboto-Regular",
        fontStyle: "italic",
        halign: "center",
      },
      styles: {
        font: "Roboto-Regular",
        fontStyle: "italic",
        fontSize: 10,
        cellPadding: 5,
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 40 },
        2: { cellWidth: 25, halign: "center" },
        3: { cellWidth: 20, halign: "center" },
        4: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [240, 248, 255],
      },
    });

    // 8. Chân trang
    const finalY = doc.lastAutoTable.finalY + 15;

    // Chữ ký bác sĩ
    doc.setFontSize(10);
    doc.setFont("Roboto-Regular", "italic");
    doc.text("BÁC SĨ CHỈ ĐỊNH", 150, finalY, { align: "center" });
    doc.setFont("Roboto-Regular", "italic");
    doc.text("(Ký, ghi rõ họ tên)", 150, finalY + 5, { align: "center" });

    // Tên bác sĩ
    doc.setFont("Roboto-Regular", "italic");
    doc.text(booking.doctorData.userData.full_name, 150, finalY + 25, {
      align: "center",
    });

    // Chữ ký bệnh nhân
    doc.setFont("Roboto-Regular", "italic");
    doc.text("BỆNH NHÂN", 60, finalY, { align: "center" });
    doc.setFont("Roboto-Regular", "italic");
    doc.text("(Ký, ghi rõ họ tên)", 60, finalY + 5, { align: "center" });

    

    // 9. Lưu file
    const patientName = booking?.patientData?.full_name || "benh-nhan";
    const fileDate = moment().format("DDMMYYYY");
    doc.save(`don-thuoc-${patientName}-${fileDate}.pdf`);
  };

 
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Pill className="h-5 w-5 text-blue-600" />
              Đơn thuốc
            </CardTitle>
 <div className="flex gap-3 px-1 py-2">
  {auth && (auth.role === 1 || auth.userId === booking?.doctorData?.userData?.id) && (
    <Button
      variant="info"
      size="sm"
      onClick={handleAddMedication}
      className="flex items-center gap-2 px-3"
      title="Thêm thuốc vào đơn" // Thêm title để vẫn có tooltip cơ bản của trình duyệt
    >
      <PlusCircle className="h-4 w-4" />
      <span>Thêm thuốc</span>
    </Button>
  )}
  
  {prescription?.prescription_details?.length > 0 && (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={generatePDF}
        className="flex items-center gap-2 px-3 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
        title="Tải xuống file PDF"
      >
        <FileDown className="h-4 w-4" />
        <span>Tải PDF</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsSendModalOpen(true)}
        className="flex items-center gap-2 px-3 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
        title="Gửi đơn thuốc cho bệnh nhân"
      >
        <Send className="h-4 w-4" />
        <span>Gửi đơn</span>
      </Button>
    </>
  )}
</div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {prescription && prescription.prescription_details?.length > 0 ? (
            <div className="space-y-4">
              {prescription.prescription_details.map((medication) => (
                <MedicationItem
                  key={medication.id}
                  booking={booking}
                  medication={medication}
                  fetch={fetchPrescriptionByAppointmentId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <Pill className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Chưa có thuốc nào được kê
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                {auth &&
                (auth.role === 1 ||
                  auth.userId === booking?.doctorData?.userData?.id)
                  ? "Thêm thuốc vào đơn bằng cách nhấn nút 'Thêm thuốc' phía trên"
                  : "Bác sĩ sẽ kê đơn thuốc tại đây khi cần thiết"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddNewPrescription
        open={addPrescriptionOpen}
        onOpenChange={setAddPrescriptionOpen}
        fetch={fetchPrescriptionByAppointmentId}
      />

      {isSendModalOpen && 
        <SendPrescriptionModal
        open={isSendModalOpen}
        onOpenChange={setIsSendModalOpen}
        booking={booking}
       prescription={prescription}
      />
      }
    </div>
  );
};

export default PrescriptionSection;
