import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  XCircle, Home, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { processPaymentCallback } from "@/api/payment.api";
const PaymentFail = () => {
  const navigate = useNavigate()

  
    useEffect(() => {
    const handlePaymentFail = async () => {
      try {
        const rawData  = localStorage.getItem("pendingPaymentData");
        if (rawData) {
          const paymentData = JSON.parse(rawData);
         const res =  await processPaymentCallback(paymentData.orderCode, {
            statusId : 3
          });  
        if(res.EC === 0)
         { localStorage.removeItem("pendingPaymentData");}
        }
      } catch (error) {
        console.error("Error processing payment success:", error);
        navigate("/");
      }
    };
  
    handlePaymentFail();
  }, [navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md border-red-200 shadow-lg">
          <CardHeader className="text-center space-y-2 pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="flex justify-center"
            >
              <XCircle className="h-20 w-20 text-red-500" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-red-600">Thanh toán thất bại</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng kiểm tra lại thông tin thanh toán và thử lại.
            </p>
           
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="outline" className="w-full sm:w-auto flex gap-2 items-center"
            onClick={() => navigate("/")}>
              <Home size={18} />
              <span>Trang chủ</span>
            </Button>
         
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentFail;