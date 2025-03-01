import { Bot, MessageCircle } from "lucide-react";
import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = { text: newMessage, sender: 'user' };
      setMessages([...messages, userMessage]);
      
      setTimeout(() => {
        const aiResponse = { text: `AI response to: ${newMessage}`, sender: 'ai' };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);

      setNewMessage('');
    }
  };

  return (
    <div className="shadow-2xl overflow-hidden h-full flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 space-y-3 chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`mx-20 max-w-[30%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-[#A2AA7B]/70 text-white self-end ml-auto' : 'bg-gray-100 text-gray-800 mr-auto flex items-center'}`}>
            {msg.sender === 'ai' && <Bot size={20} className="mr-2 text-gray-500" />}
            {msg.text}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSendMessage} className=" mb-5 px-20 flex items-center gap-3">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..." 
          className="flex-grow px-4 py-2 bg-gray-200 rounded-full outline-none box-shadow-none"
        />
        <button 
          type="submit" 
          className="bg-[#A2AA7B] text-white p-2 rounded-full"
        >
          <MessageCircle size={24} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
