import React, { useState, useRef, useEffect } from "react";
import {
    FaRobot,
    FaPaperPlane,
    FaTimes,
    FaUser,
} from "react-icons/fa";

const Chatbot = () => {
    const [toggle, setToggle] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: "Hi! 👋 How can I help you today?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
    ]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (toggle) {
            scrollToBottom();
        }
    }, [messages, loading, toggle]);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const safeStringify = (val) => {
        if (typeof val === "string") return val;
        if (typeof val === "number" || typeof val === "boolean") return String(val);

        if (val !== null && typeof val === "object") {

            if (Array.isArray(val)) {
                const extractedTexts = val
                    .map((item) => safeStringify(item))
                    .filter(Boolean);
                return extractedTexts.join("\n\n");
            }


            if (val.text && typeof val.text === "string") return val.text;
            if (val.message && typeof val.message === "string") return val.message;
            if (val.response && typeof val.response === "string") return val.response;
            if (val.content && typeof val.content === "string") return val.content;
            if (val.output && typeof val.output === "string") return val.output;


            if (val.content && typeof val.content === "object") {
                return safeStringify(val.content);
            }


            try {
                return JSON.stringify(val, null, 2);
            } catch {
                return "Unable to parse response object.";
            }
        }

        return String(val || "");
    };

    const handleSend = async () => {
        const query = message.trim();
        if (!query || loading) return;

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: query,
            time: getCurrentTime(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query }),
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();


            let rawResponse = data.response ?? data.message ?? data.answer ?? data.output ?? data;
            let formattedText = safeStringify(rawResponse);

            const botMessage = {
                id: Date.now() + 1,
                sender: "bot",
                text: formattedText || "Sorry, response empty mila.",
                time: getCurrentTime(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat API Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: "Sorry! Server se response nahi aa raha. Please try again.",
                    time: getCurrentTime(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Chatbot Window */}
            <div
                className={`fixed bottom-20 right-4 sm:right-6 
                w-[calc(100%-2rem)] sm:w-100
                h-130 max-h-[75vh]
                bg-white rounded-2xl shadow-2xl
                border border-gray-200 overflow-hidden z-50
                transition-all duration-300 origin-bottom-right flex flex-col
                ${toggle
                        ? "scale-100 opacity-100 pointer-events-auto"
                        : "scale-0 opacity-0 pointer-events-none"
                    }`}
            >
                {/* Header */}
                <div
                    className="h-16 shrink-0 bg-linear-to-r from-blue-600 
                    to-indigo-600 px-4 flex items-center 
                    justify-between text-white"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-white/20 rounded-full 
                            flex items-center justify-center"
                        >
                            <FaRobot className="text-xl" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-sm sm:text-base">
                                AI Medical Assistant
                            </h2>

                            <div className="flex items-center gap-1.5">
                                <span
                                    className="w-2 h-2 bg-green-400 
                                    rounded-full animate-pulse"
                                ></span>

                                <span className="text-xs text-blue-100">
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setToggle(false)}
                        className="w-8 h-8 rounded-full 
                        hover:bg-white/20 flex items-center 
                        justify-center transition cursor-pointer"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : ""
                                }`}
                        >
                            {/* Bot Icon */}
                            {msg.sender === "bot" && (
                                <div
                                    className="w-8 h-8 shrink-0 
                                    bg-blue-600 text-white rounded-full 
                                    flex items-center justify-center mt-1"
                                >
                                    <FaRobot className="text-sm" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] ${msg.sender === "user" ? "order-first" : ""
                                    }`}
                            >
                                <div
                                    className={`px-4 py-3 ${msg.sender === "user"
                                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-xs"
                                        : "bg-white border border-gray-200 shadow-xs text-gray-800 rounded-2xl rounded-tl-xs"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed wrap-break-word">
                                        {msg.text}
                                    </p>
                                </div>

                                <span
                                    className={`text-[10px] text-gray-400 mt-1 block ${msg.sender === "user"
                                        ? "text-right mr-1"
                                        : "ml-1"
                                        }`}
                                >
                                    {msg.time}
                                </span>
                            </div>

                            {/* User Icon */}
                            {msg.sender === "user" && (
                                <div
                                    className="w-8 h-8 shrink-0 
                                    bg-gray-200 text-gray-600 rounded-full 
                                    flex items-center justify-center mt-1"
                                >
                                    <FaUser className="text-sm" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex items-start gap-2">
                            <div
                                className="w-8 h-8 shrink-0 
                                bg-blue-600 text-white rounded-full 
                                flex items-center justify-center"
                            >
                                <FaRobot className="text-sm" />
                            </div>

                            <div
                                className="bg-white border border-gray-200 
                                shadow-xs rounded-2xl rounded-tl-xs 
                                px-4 py-3"
                            >
                                <div className="flex gap-1.5 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Target Ref for Auto Scroll */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="h-16 shrink-0 bg-white border-t border-gray-200 p-2.5">
                    <div className="flex items-center gap-2 h-full">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSend();
                                }
                            }}
                            placeholder="Type your message..."
                            disabled={loading}
                            className="flex-1 h-10 px-4 text-sm 
                            bg-gray-100 rounded-full outline-none 
                            focus:ring-2 focus:ring-blue-500 
                            transition disabled:opacity-50"
                        />

                        <button
                            onClick={handleSend}
                            disabled={loading || !message.trim()}
                            className="w-10 h-10 shrink-0 
                            bg-blue-600 hover:bg-blue-700 
                            disabled:bg-gray-300 
                            text-white rounded-full 
                            flex items-center justify-center 
                            transition active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                        >
                            <FaPaperPlane className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <button
                onClick={() => setToggle(!toggle)}
                className="fixed bottom-5 right-4 sm:right-6 
                w-14 h-14 bg-linear-to-r 
                from-blue-600 to-indigo-600 
                text-white rounded-full shadow-lg 
                flex items-center justify-center z-50 
                hover:scale-110 transition-all duration-300 
                active:scale-95 cursor-pointer"
            >
                {toggle ? (
                    <FaTimes className="text-xl" />
                ) : (
                    <FaRobot className="text-2xl" />
                )}
            </button>
        </>
    );
};

export default Chatbot;