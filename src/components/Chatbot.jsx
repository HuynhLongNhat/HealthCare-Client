import { useState, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { handleAsk } from "@/api/chatbot.api";
import chatbot from "../../public/chatbot.png";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Đây là chatbot của HealthCare. Tôi có thể giúp gì cho bạn?",
      isBot: true,
      time: new Date().toISOString() // Thêm thời gian cho message đầu tiên
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { 
      text: inputMessage, 
      isBot: false,
      time: new Date().toISOString() // Thêm thời gian khi user gửi
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await handleAsk({ question: inputMessage });
      console.log("res", res);
      const botMessage = {
        text: res.answer || "Xin lỗi, tôi chưa có câu trả lời.",
        isBot: true,
        time: res.metadata?.timestamp || new Date().toISOString() // Sử dụng thời gian từ server hoặc tạo mới
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { 
          text: "Có lỗi xảy ra, vui lòng thử lại sau.", 
          isBot: true,
          time: new Date().toISOString()
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105"
          aria-label="Open chat"
        >
          <img src={chatbot} alt="Chatbot" className="w-16 h-16 object-contain" />
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] h-[540px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md">
                <img src={chatbot} alt="Chatbot" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-white font-semibold text-lg">HealthCare Chat</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-3 ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[75%] ${message.isBot ? "" : "flex flex-col items-end"}`}>
                  <div
                    className={`px-4 py-2 text-sm whitespace-pre-line rounded-2xl ${
                      message.isBot
                        ? "bg-white text-gray-800 shadow border border-gray-200"
                        : "bg-blue-600 text-white"
                    } animate-slideIn`}
                  >
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 text-gray-500 ${message.isBot ? "text-left" : "text-right"}`}>
                    {formatTime(message.time)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white px-3 py-2 rounded-2xl shadow border border-gray-200">
                  <BsThreeDots className="w-6 h-6 text-gray-500 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Type your message"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                aria-label="Send message"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;