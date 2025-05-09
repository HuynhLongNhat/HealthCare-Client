// AddRatingDialog.jsx
import { createRatingDoctor } from "@/api/doctor.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getAuth } from "@/utils/getAuth";
import { Check, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const AddRatingDialog = ({ open, onOpenChange, doctorId, onSuccess }) => {
  const auth = getAuth();
  const [newReview, setNewReview] = useState({
    ratings: {
      expertise: 5,
      attitude: 5,
      price: 5
    },
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddReview = async () => {
    if (!auth.userId) {
      toast.error("Bạn cần đăng nhập để đánh giá");
      return;
    }

    if (!newReview.content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewPayload = {
        doctor_id: doctorId, 
        patient_id: auth.userId, 
        professionalism_rating: newReview.ratings.expertise,
        attitude_rating: newReview.ratings.attitude,
        price_rating: newReview.ratings.price,
        comment: newReview.content,
      };
      
      const response = await createRatingDoctor(reviewPayload);
      
      if (response.EC === 0) {
        toast.success(response.EM);
        resetForm();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.EM);
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewReview({
      ratings: {
        expertise: 5,
        attitude: 5,
        price: 5
      },
      content: "",
    });
  };

  const renderEditableStars = (rating, criterionId) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        className={
          i < rating
            ? "text-yellow-400 fill-current cursor-pointer"
            : "text-gray-300 cursor-pointer hover:text-yellow-200"
        }
        onClick={() => {
          const updatedRatings = {...newReview.ratings, [criterionId]: i + 1};
          setNewReview({...newReview, ratings: updatedRatings});
        }}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Thêm đánh giá mới</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về bác sĩ này để giúp những bệnh nhân khác
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Đánh giá theo tiêu chí:</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700">Chuyên môn</span>
                <div className="flex gap-1">
                  {renderEditableStars(newReview.ratings.expertise, 'expertise')}
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700">Thái độ phục vụ</span>
                <div className="flex gap-1">
                  {renderEditableStars(newReview.ratings.attitude, 'attitude')}
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700">Giá cả</span>
                <div className="flex gap-1">
                  {renderEditableStars(newReview.ratings.price, 'price')}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung đánh giá
            </label>
            <Textarea
              value={newReview.content}
              onChange={(e) => setNewReview({...newReview, content: e.target.value})}
              placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="min-w-[80px]"
          >
            <X className="mr-2" size={16} />
            Hủy
          </Button>
          <Button 
            onClick={handleAddReview}
            disabled={isSubmitting || !newReview.content.trim()}
            className="min-w-[80px] bg-blue-600 hover:bg-blue-700"
          >
            <Check className="mr-2" size={16} />
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRatingDialog;