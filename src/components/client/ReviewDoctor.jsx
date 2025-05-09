// ReviewDoctor.jsx
import {
  deleteRatingDoctor,
  getDoctorRatingsByDoctorId,
} from "@/api/doctor.api";
import { Button } from "@/components/ui/button";
import { getAuth } from "@/utils/getAuth";
import { Star, Plus, Trash, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddRatingDialog from "./AddRatingDoctor";
import EditRatingDialog from "./EditRatingDoctor";
import DeleteModal from "../DeleteModal";
import moment from "moment";

const ReviewDoctor = () => {
  const auth = getAuth();
  const { doctorId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [criteriaStats, setCriteriaStats] = useState({
    overall: 0,
    expertise: 0,
    attitude: 0,
    price: 0,
  });

  useEffect(() => {
    fetchAllRatingDoctorByDoctorId();
  }, [doctorId]);

  const fetchAllRatingDoctorByDoctorId = async () => {
    try {
      const res = await getDoctorRatingsByDoctorId(doctorId);
      if (res && res.EC === 0) {
        setRatings(res.DT);
        calculateStats(res.DT);
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá bác sĩ:", error);
    }
  };

  const calculateStats = (ratingData) => {
    if (!ratingData || ratingData.length === 0) {
      setCriteriaStats({
        overall: 0,
        expertise: 0,
        attitude: 0,
        price: 0,
      });
      return;
    }

    let totalExpertise = 0;
    let totalAttitude = 0;
    let totalPrice = 0;

    ratingData.forEach((item) => {
      totalExpertise += item.rating.professionalism_rating;
      totalAttitude += item.rating.attitude_rating;
      totalPrice += item.rating.price_rating;
    });

    const avgExpertise = totalExpertise / ratingData.length;
    const avgAttitude = totalAttitude / ratingData.length;
    const avgPrice = totalPrice / ratingData.length;
    const overall = (avgExpertise + avgAttitude + avgPrice) / 3;

    setCriteriaStats({
      overall: overall.toFixed(1),
      expertise: avgExpertise.toFixed(1),
      attitude: avgAttitude.toFixed(1),
      price: avgPrice.toFixed(1),
    });
  };

  const handleEditRating = (rating) => {
    setSelectedRating(rating);
    setIsEditDialogOpen(true);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }
      />
    ));
  };

  const criteriaItems = [
    { id: "expertise", title: "Chuyên môn", value: criteriaStats.expertise },
    { id: "attitude", title: "Thái độ phục vụ", value: criteriaStats.attitude },
    { id: "price", title: "Giá cả", value: criteriaStats.price },
  ];

  const openDeleteModal = (rating) => {
    setDataToDelete(rating);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {

    return deleteRatingDoctor(dataToDelete.rating.id);
  };
  return (
    <div className="mt-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Đánh giá về bác sĩ
        </h2>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm w-full md:w-auto flex flex-col items-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {criteriaStats.overall}
            </div>
            <div className="flex gap-1 mb-3">
              {renderStars(Math.round(criteriaStats.overall))}
            </div>
            <p className="text-gray-600 text-sm">
              Dựa trên {ratings.length} đánh giá
            </p>
          </div>

          <div className="space-y-4 flex-1 ">
            {criteriaItems.map((criterion) => (
              <div key={criterion.id} className="flex items-center gap-4">
                <span className="w-40 text-gray-700 font-medium">
                  {criterion.title}
                </span>
                <div className="flex-1  h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    style={{ width: `${(criterion.value / 5) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 w-32">
                  <span className="text-gray-700 font-medium">
                    {criterion.value}
                  </span>
                  <div className="flex gap-0.5">
                    {renderStars(Math.round(criterion.value))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <span>Tất cả đánh giá</span>
            <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-semibold py-1 px-3 rounded-full">
              {ratings?.length}
            </span>
          </h3>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="default"
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Thêm đánh giá</span>
          </Button>
        </div>

        {ratings?.length > 0 ? (
          <div className="space-y-6">
            {ratings.map((rating) => (
              <div
                key={rating.rating.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                {/* Header với avatar và thông tin người đánh giá */}
                <div className="flex justify-between items-start gap-4 mb-6">
                  {/* Avatar and user info */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      {rating.userData.profile_picture ? (
                        <img
                          src={rating.userData.profile_picture}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                          {rating.userData.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {rating.userData.full_name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex gap-1">
                          {renderStars(
                            Math.round(
                              (rating.rating.professionalism_rating +
                                rating.rating.attitude_rating +
                                rating.rating.price_rating) /
                                3
                            )
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(rating.rating.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Edit and delete buttons - positioned far right */}
                  {auth.userId === rating.rating.patient_id && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
                      <Button
                        onClick={() => handleEditRating(rating)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={16} className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(rating)}
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash size={16} className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {/* Chi tiết đánh giá theo tiêu chí */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-600">
                      Chuyên môn
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {renderStars(rating.rating.professionalism_rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {rating.rating.professionalism_rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-600">
                      Thái độ phục vụ
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {renderStars(rating.rating.attitude_rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {rating.rating.attitude_rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-600">
                      Giá cả
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {renderStars(rating.rating.price_rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {rating.rating.price_rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nội dung đánh giá */}
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {rating.rating.comment ||
                      "Người dùng không để lại bình luận."}
                  </p>
                </div>

                {/* Footer with updated time */}
                <div className="flex justify-end items-center border-t border-gray-100 pt-4">
                  {rating.rating.updatedAt &&
                    rating.rating.updatedAt !== rating.rating.createdAt && (
                      <span className="text-sm text-gray-500">
                        Đã chỉnh sửa vào{" "}
                        {moment(rating.rating.updatedAt).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-xl text-center">
            <p className="text-gray-500">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá bác sĩ này!
            </p>
          </div>
        )}
      </div>

      {/* Add Rating Dialog */}
      <AddRatingDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        doctorId={doctorId}
        onSuccess={fetchAllRatingDoctorByDoctorId}
      />

      {/* Edit Rating Dialog */}
      <EditRatingDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        rating={selectedRating}
        onSuccess={fetchAllRatingDoctorByDoctorId}
      />
      {dataToDelete && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={dataToDelete}
          handleDelete={handleDelete}
          fetch={fetchAllRatingDoctorByDoctorId}
        />
      )}
    </div>
  );
};

export default ReviewDoctor;
