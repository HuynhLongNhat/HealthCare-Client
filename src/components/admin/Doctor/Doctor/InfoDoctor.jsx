import { Stethoscope } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const InfoDoctor = ({ doctor }) => {
  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Stethoscope className="text-blue-600 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tiểu sử Bác sĩ</h1>
        </div>
      </div>

      <div className="prose prose-blue max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-800" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-xl font-semibold mb-4 mt-6 text-blue-700" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-gray-700 leading-relaxed mb-4" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 space-y-1 mb-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 space-y-1 mb-4" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-gray-700 mb-1 ml-5" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-gray-800" {...props} />
            ),
          }}
        >
          {String(doctor?.doctor?.bio || "")}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default InfoDoctor;