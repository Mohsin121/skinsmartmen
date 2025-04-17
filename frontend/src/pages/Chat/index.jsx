import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import Markdown from "react-markdown";
import { BeatLoader } from "react-spinners";

import rehypeRaw from "rehype-raw";
const Chat = () => {
  const location = useLocation();
  const { sessionId } = location.state;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initializeChat = async () => {
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        // First get the session
        const sessionResponse = await axios.get(
          `http://localhost:8000/api/session/${sessionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sessionMessages = sessionResponse.data.data.messages;

        // If it's a new session and there are no messages, get initial response
        if (location.state?.isNewSession && sessionMessages.length === 0) {
          const response = await axios.post(
            `http://localhost:8000/api/session/initial-response/${sessionId}`,
            { formData: location.state.formData },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessages(response.data.data.messages);
        } else {
          // Use existing messages
          setMessages(sessionMessages);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [sessionId, location.state]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const token = localStorage.getItem("token");
    const newMessage = { question: userInput, isUser: true };

    // Add user message immediately
    setMessages((prev) => [...prev, newMessage]);

    // Add loading message
    const loadingMessage = {
      answer: "...",
      isLoading: true,
      isUser: false,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    setUserInput("");
    scrollToBottom();

    try {
      const response = await axios.post(
        `http://localhost:8000/api/session`,
        {
          message: userInput,
          sessionId: sessionId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace loading message with actual response
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove loading message
        { answer: response.data.data.answer, isUser: false }, // Add AI response
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Replace loading message with error
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { answer: "Sorry, there was an error processing your request." },
      ]);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }, 100);
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAF5] pt-1">
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-4 md:px-6 py-6 overflow-y-auto " id="chat-messages">
          <div className="max-w-8xl mx-auto space-y-6">
            {loading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full min-h-[200px]">
                <BeatLoader color="#7C9C73" size={12} />
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-6 ${
                      message.isUser
                        ? "bg-[#A2AA7B] text-white shadow-lg"
                        : "bg-white text-gray-800 shadow-lg border-2 border-sage-100"
                    } ${
                      message.isUser ? "rounded-tr-none" : "rounded-tl-none"
                    } transform transition-all duration-200 hover:shadow-xl`}
                  >
                    {message.isLoading ? (
                      <BeatLoader color="#7C9C73" size={8} />
                    ) : message.question ? (
                      <div className="text-base md:text-lg font-medium leading-relaxed ">
                        {message.question}
                      </div>
                    ) : (
                      <div className="prose prose-lg max-w-none prose-headings:text-sage-800 prose-p:leading-relaxed prose-strong:text-sage-700 prose-ul:my-2 prose-li:my-0">
                        <Markdown 
                          rehypePlugins={[rehypeRaw]}
                          
                        >
                          {message.answer}
                        </Markdown>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
  
      {/* Message Input */}
      <div className="border-t border-sage-200 bg-white px-4 md:px-6 py-4 shadow-lg ">
        <div className="w-full mx-auto">
          <form onSubmit={sendMessage} className="flex gap-3 items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 p-4 text-base border-2 border-sage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 bg-white transition-all duration-200"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              type="submit"
              className="px-6 py-4 bg-[#A2AA7B] text-white rounded-xl hover:bg-sage-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
              disabled={loading || !userInput.trim()}
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline font-medium">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;