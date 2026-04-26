import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getConversations, getMessages, sendMessage } from "../api/chat.api.js";
import { getSocket } from "../api/socket.api.js";
import Header from "../components/Header";
import "./MessagesPage.css";

export default function MessagesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    const socket = getSocket();
    if (socket) {
      socket.on("newMessage", (msg) => {
        // If the message is from the currently selected chat, add it to messages list
        if (selectedChat && (msg.sender === selectedChat.otherParticipant._id || msg.receiver === selectedChat.otherParticipant._id)) {
          setMessages((prev) => [...prev, msg]);
        }
        // Always refresh conversations to update "last message" and order
        fetchConversations();
      });
    }

    return () => {
      if (socket) socket.off("newMessage");
    };
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.otherParticipant._id);
    } else if (location.state?.recipient) {
      // If we came from a profile "Message" button
      const recipient = location.state.recipient;
      // Check if conversation already exists in sidebar
      const existingConv = conversations.find(c => c.otherParticipant._id === recipient._id);
      if (existingConv) {
        setSelectedChat(existingConv);
      } else {
        // Create a temporary "pseudo-conversation" for the UI
        setSelectedChat({
          _id: "new",
          otherParticipant: recipient,
          isNew: true
        });
      }
    }
  }, [selectedChat, location.state, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await getMessages(userId);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const res = await sendMessage(selectedChat.otherParticipant._id, newMessage);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      
      // If it was a new conversation, refresh everything to get proper IDs
      if (selectedChat.isNew) {
        const refreshedConvs = await getConversations();
        setConversations(refreshedConvs.data);
        const newConv = refreshedConvs.data.find(c => c.otherParticipant._id === selectedChat.otherParticipant._id);
        if (newConv) setSelectedChat(newConv);
      } else {
        fetchConversations(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="messages-main">
        <div className="messages-layout glass">
          {/* Sidebar */}
          <aside className="chat-sidebar">
            <div className="sidebar-header">
              <h2>Messages</h2>
            </div>
            <div className="conversations-list">
              {loading ? (
                <p className="loading-text">Loading chats...</p>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`conversation-item ${selectedChat?._id === conv._id ? "active" : ""}`}
                    onClick={() => setSelectedChat(conv)}
                  >
                    <div className="participant-avatar">
                      {conv.otherParticipant.avatar ? (
                        <img src={conv.otherParticipant.avatar} alt={conv.otherParticipant.username} />
                      ) : (
                        <span>{conv.otherParticipant.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="conversation-info">
                      <p className="participant-name">{conv.otherParticipant.fullName}</p>
                      <p className="last-message">
                        {conv.lastMessage?.content || "Start a conversation"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-text">No conversations yet</p>
              )}
            </div>
          </aside>

          {/* Chat Window */}
          <section className="chat-window">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <div className="participant-avatar small">
                    {selectedChat.otherParticipant.avatar ? (
                      <img src={selectedChat.otherParticipant.avatar} alt={selectedChat.otherParticipant.username} />
                    ) : (
                      <span>{selectedChat.otherParticipant.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h3>{selectedChat.otherParticipant.fullName}</h3>
                </div>

                <div className="messages-thread">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message-bubble ${msg.sender === user._id ? "sent" : "received"}`}
                    >
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" disabled={!newMessage.trim()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="chat-placeholder">
                <div className="placeholder-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3>Your Messages</h3>
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
