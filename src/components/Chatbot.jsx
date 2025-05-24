import { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Bot,
  Loader2,
  ChevronDown,
  UserCircle2,
  MessageCircle,
} from "lucide-react";
import { handleAsk } from "@/api/chatbot.api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import chatbotAvatar from "../../public/chatbot.png";
import ResponseFormatter from "./ResponseFormatter";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Xin chào! Mình là trợ lí AI của HealthCare. Mình có thể giúp gì cho bạn?",
      isBot: true,
      time: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      isBot: false,
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await handleAsk({ question: inputMessage });
      console.log("Res" ,res)
      const botMessage = {
        text:  <ResponseFormatter content={res.answer }/> || "Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này.",
        isBot: true,
        time: res.metadata?.timestamp || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Có lỗi xảy ra, vui lòng thử lại sau.",
          isBot: true,
          time: new Date().toISOString(),
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
      <AnimatePresence>
        {!isOpen ? (
          <Avatar
            className="h-16 w-16 border-2 border-white/20"
            onClick={() => setIsOpen(true)}
          >
            <AvatarImage src={chatbotAvatar} alt="Trợ lý AI" />
            <AvatarFallback className="bg-primary-foreground text-primary">
              <Bot className="h-16 w-16" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-[380px] h-[530px] bg-background rounded-xl shadow-xl flex flex-col overflow-hidden border"
          >
            <Card className="w-full h-full flex flex-col shadow-none border-0">
              <CardHeader className="bg-blue-400 p-4 flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ">
                    <AvatarImage src={chatbotAvatar} alt="Trợ lý AI" />
                    <AvatarFallback className="bg-primary-foreground text-primary">
                      <Bot className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-primary-foreground">
                      Trợ lý AI HealthCare
                    </h3>
                   
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-3 p-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: message.isBot ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex items-end gap-2 max-w-[90%]",
                          message.isBot
                            ? "self-start"
                            : "self-end flex-row-reverse"
                        )}
                      >
                        {message.isBot && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={chatbotAvatar} alt="Trợ lý AI" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        {!message.isBot && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              <UserCircle2 className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className="flex flex-col gap-1">
                          <div
                            className={cn(
                              "px-4 py-2.5 rounded-2xl text-sm",
                              message.isBot
                                ? "bg-muted border border-border"
                                : "bg-blue-500 text-white "
                            )}
                          >
                            {message.text}
                          </div>
                          <span className="text-xs text-muted-foreground px-1">
                            {formatTime(message.time)}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end gap-2 self-start"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={chatbotAvatar} alt="Trợ lý AI" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted border border-border rounded-full px-4 py-2.5 flex items-center">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-3 border-t">
                <form
                  className="flex w-full items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  <Input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 rounded-full bg-muted border-muted focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputMessage.trim() || isTyping}
                   variant="ghost"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 text-blue-800" />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
