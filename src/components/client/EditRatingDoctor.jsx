/* eslint-disable react/prop-types */
// EditRatingDialog.jsx
import { updateRatingDoctor } from "@/api/doctor.api";
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
import { Check, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditRatingDialog = ({ open, onOpenChange, rating, onSuccess }) => {
  const [editedReview, setEditedReview] = useState({
    ratings: {
      expertise: 5,
      attitude: 5,
      price: 5
    },
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rating && open) {
      setEditedReview({
        ratings: {
          expertise: rating.rating.professionalism_rating,
          attitude: rating.rating.attitude_rating,
          price: rating.rating.price_rating
        },
        content: rating.rating.comment || "",
      });
    }
  }, [rating, open]);

  const handleUpdateReview = async () => {
    if (!rating) return;
    
    if (!editedReview.content.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatePayload = { 
        professionalism_rating: editedReview.ratings.expertise,
        attitude_rating: editedReview.ratings.attitude,
        price_rating: editedReview.ratings.price,
        comment: editedReview.content,
      };    
      const response = await updateRatingDoctor(rating.rating.id ,updatePayload);
      
      if (response.EC === 0) {
        toast.success(response.EM || "Cập nhật đánh giá thành công");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.EM || "Cập nhật đánh giá không thành công");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật đánh giá");
    } finally {
      setIsSubmitting(false);
    }
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
          const updatedRatings = {...editedReview.ratings, [criterionId]: i + 1};
          setEditedReview({...editedReview, ratings: updatedRatings});
        }}
      />
    ));
  };

  if (!rating) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Chỉnh sửa đánh giá</DialogTitle>
          <DialogDescription>
            Cập nhật đánh giá của bạn về bác sĩ
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Đánh giá theo tiêu chí:</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700">Chuyên môn</span>
                <div className="flex gap-1">
                  {renderEditableStars(editedReview.ratings.expertise, 'expertise')}
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700">Thái độ phục vụ</span>
                <div className="flex gap-1">
                  {renderEditableStars(editedReview.ratings.attitude, 'attitude')}
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700">Giá cả</span>
                <div className="flex gap-1">
                  {renderEditableStars(editedReview.ratings.price, 'price')}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung đánh giá
            </label>
            <Textarea
              value={editedReview.content}
              onChange={(e) => setEditedReview({...editedReview, content: e.target.value})}
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
            onClick={handleUpdateReview}
            disabled={isSubmitting || !editedReview.content.trim()}
            variant="info"
          >
            <Check className="mr-2" size={16} />
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRatingDialog;