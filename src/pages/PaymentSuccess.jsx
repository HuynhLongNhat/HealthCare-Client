import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { processPaymentCallback } from "@/api/payment.api";
import { confirmPayment } from "@/api/appointment.api";
const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const rawData = localStorage.getItem("pendingPaymentData");
        if (rawData) {
          const paymentData = JSON.parse(rawData);
          const res = await processPaymentCallback(paymentData.orderCode, {
            statusId: 2,
          });
          if (res.EC === 0) {
             await confirmPayment(paymentData.appointmentId)
            localStorage.removeItem("pendingPaymentData");
          }
        }
      } catch (error) {
        console.error("Error processing payment success:", error);
        navigate("/");
      }
    };

    handlePaymentSuccess();
  }, [navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-green-200 shadow-lg">
          <CardHeader className="text-center space-y-2 pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="flex justify-center"
            >
              <CheckCircle className="h-20 w-20 text-green-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Thanh toán thành công
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Cảm ơn bạn! Giao dịch của bạn đã được xử lý thành công.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex gap-2 items-center"
              onClick={() => navigate("/")}
            >
              <Home size={18} />
              <span>Trang chủ</span>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
