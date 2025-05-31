/* eslint-disable react/prop-types */
import DiagnosisSection from "../Diagnosis/DiagnosisSection";
import PrescriptionSection from "./PrescriptionSection";

const MedicalExaminationResults = ({ booking }) => {

  return (
    <div className="">
      {/* Phần chẩn đoán */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <DiagnosisSection booking={booking} />
      </div>
      <PrescriptionSection booking={ booking} />
    </div>
  );
};

export default MedicalExaminationResults;
