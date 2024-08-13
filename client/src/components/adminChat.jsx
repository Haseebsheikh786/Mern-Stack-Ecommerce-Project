import React, { useEffect, useState, useRef } from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { axiosInstance } from "./../pages/auth/authApi";
import { selectUserInfo } from "./../pages/auth/authSlice";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import io from "socket.io-client";
import { LoaderCircle } from "lucide-react";

const Chat = () => {
  const user = useSelector(selectUserInfo);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const scrollAreaRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState({});
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setChatId({});
  };
  const changeChat = () => {
    setChatId({});
    setMessages([]);
  };

  const sendMessage = async (e) => {
    // Handle message sending on both Enter key press and button click
    if (e.key === "Enter" || e.type === "click") {
      if (newMessage.trim()) {
        // Only send non-empty messages
        const data = {
          sender: user._id,
          content: newMessage,
          chat: chatId,
          sender_name: user.userName,
          sender_role: user.role,
        };

        try {
          setNewMessage(""); // Clear input field after successful message sending
          socketRef.current.emit("new_message", data); // Emit the message through the socket
          await axiosInstance.post("api/message", data);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axiosInstance.get(`api/chats`);
      setChats(res.data);
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async (chat) => {
    setLoading(true);
    setChatId(chat);
    const res = await axiosInstance.get(`api/chat/${chat._id}`);
    setMessages(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);
 
  useEffect(() => {
    // Initialize Socket.io connection
    socketRef.current = io(""); // Replace with your server URL

    // Handle incoming messages
    socketRef.current.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Handle user connected
    socketRef.current.on("connect", () => {
      console.log("Connected to the server");
    });

    // Handle user disconnected
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div>
      {!isChatOpen && (
        <div onClick={toggleChat} className="fixed bottom-8 right-8 z-50">
          <button className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 16 16"
            >
              <g fill="currentColor">
                <path d="M5 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
                <path d="m2.165 15.803l.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7s-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6s-3.004 6-7 6a8 8 0 0 1-2.088-.272a1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
              </g>
            </svg>
          </button>
        </div>
      )}

      {/* Chat box */}
      {isChatOpen && !chatId._id && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 " onClick={toggleChat}></div>
          <Card className="fixed bottom-0 z-50 sm:right-4 sm:w-96 w-screen bg-background h-[500px] rounded-lg transition-transform transform translate-y-0">
            <div className="bg-blue-500 text-white p-2 flex justify-between items-center">
              <h3 className="text-lg">Chats </h3>
              <button onClick={toggleChat} className="text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div
              ref={scrollAreaRef}
              className=" p-3  Z-50"
              style={{
                height: "465px",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // Default for IE and Edge
              }}
            >
              {chats.map((chat) =>
                chat?.user?.role === "user" ? (
                  <div
                    key={chat._id}
                    onClick={() => fetchMessages(chat)}
                    className="py-2 border-b flex items-center rounded-md cursor-pointer transition-transform transform"
                  >
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback>{chat.user?.userName[0]}</AvatarFallback>
                    </Avatar>

                    {/* Chat Info */}
                    <div className="flex-1 ml-3">
                      <p className="font-semibold">{chat.user.userName}</p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </Card>
        </div>
      )}
      {isChatOpen && chatId._id && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 " onClick={toggleChat}></div>
          <Card className="fixed bottom-0 z-50 sm:right-4 w-screen sm:w-96 bg-background h-[500px] rounded-lg transition-transform transform translate-y-0">
            <div className="bg-blue-500 text-white p-2 flex justify-between items-center">
              <button onClick={changeChat}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-lg">{chatId?.user?.userName} </h3>
              <button onClick={toggleChat} className="text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div
              ref={scrollAreaRef}
              className=" p-3  Z-50"
              style={{
                height: "396px",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin", // For Firefox
                msOverflowStyle: "auto", // Default for IE and Edge
              }}
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <LoaderCircle class="mr-2 h-8 w-8 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  Start a conversation by sending a message
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={message.id} className="mb-2">
                    {message.sender_role === "user" ? (
                      <div className="flex items-center mr-10">
                        <div className="bg-card shadow border rounded-md p-2">
                          <p className="pr-6">{message.content}</p>
                          <p className="text-xs text-muted-foreground text-end">
                            {new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end justify-end space-x-2 my-2 ml-10" >
                        <div className="bg-muted shadow border rounded-md p-2">
                          <p className="pr-6">{message.content}</p>
                          <p className="text-xs text-muted-foreground text-end">
                            {new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="border-t relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={sendMessage}
                type="text"
                className="h-14 w-full focus-visible:ring-0 focus-visible:ring-0 "
                placeholder="Type a message..."
              />
              <div
                onClick={sendMessage}
                className="absolute cursor-pointer right-0 top-3 right-2 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M4 18.5v-13L19.423 12zM5 17l11.85-5L5 7v3.885L9.846 12 5 13.116zm0 0V7z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Chat;
