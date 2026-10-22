import { apiUrl, API_URL } from "../config/api";
import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { Send, User as UserIcon, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

let socket;

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      socket = io(API_URL);
      socket.emit("join_room", user._id);
      fetchConversations();

      socket.on("receive_message", (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      const res = await axios.get(apiUrl("/api/messages/conversations/all"), config);
      if (res.data.success) {
        setConversations(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setLoading(false);
      
      // Handle navigation from "Contact" button on FindWorkers
      if (location.state?.initialUser) {
        const initUser = location.state.initialUser;
        setSelectedUser(initUser);
        fetchMessages(initUser._id);
        
        // Add to conversations if not present
        setConversations(prev => {
          if (!prev.find(c => c._id === initUser._id)) {
            return [initUser, ...prev];
          }
          return prev;
        });
        
        // Clear state to prevent re-triggering on refresh
        window.history.replaceState({}, document.title);
      }
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
      const res = await axios.get(apiUrl(`/api/messages/${userId}`), config);
      if (res.data.success) {
        setMessages(res.data.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const handleSelectUser = (chatUser) => {
    setSelectedUser(chatUser);
    fetchMessages(chatUser._id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    socket.emit("send_message", {
      senderId: user._id,
      receiverId: selectedUser._id,
      text: newMessage
    });

    setNewMessage("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#0D6EFD]" /></div>;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900 pt-8 px-4 max-w-7xl mx-auto pb-12 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 rounded-l-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
        </div>
        <div className="overflow-y-auto flex-grow">
          {conversations.length === 0 ? (
            <div className="p-6 text-slate-500 dark:text-slate-400 text-center">No conversations yet.</div>
          ) : (
            conversations.map((c) => (
              <div 
                key={c._id} 
                onClick={() => handleSelectUser(c)}
                className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 ${selectedUser?._id === c._id ? 'bg-slate-50 dark:bg-slate-700/50' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 overflow-hidden shrink-0">
                  {c.profileImage ? <img src={c.profileImage} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{c.name}</h4>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 bg-white dark:bg-slate-800 rounded-r-2xl shadow-sm flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 overflow-hidden">
                {selectedUser.profileImage ? <img src={selectedUser.profileImage} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5" />}
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedUser.name}</h3>
            </div>

            <div className="flex-grow p-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.senderId === user._id ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[70%] ${m.senderId === user._id ? 'bg-[#0D6EFD] text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-none shadow-sm'}`}>
                    {m.text}
                  </div>
                  <span className="text-xs text-slate-400 mt-1">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                />
                <button type="submit" className="p-3 bg-[#0D6EFD] text-white rounded-xl hover:bg-[#0b5ed7] transition-colors flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <Send className="w-8 h-8 opacity-50" />
            </div>
            <p className="font-medium text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
