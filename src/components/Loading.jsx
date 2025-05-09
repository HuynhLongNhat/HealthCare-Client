import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-80 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center space-y-6 p-10">
          <Loader2 className="animate-spin h-20 w-20 text-blue-500" />
          <p className="text-2xl font-bold text-blue-800">Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;
