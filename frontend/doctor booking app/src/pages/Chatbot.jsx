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
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        },
    ]);

    // ============================================================
    // SCROLL TO BOTTOM
    // ============================================================

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    useEffect(() => {
        if (toggle) {
            scrollToBottom();
        }
    }, [messages, loading, toggle]);

    // ============================================================
    // CURRENT TIME
    // ============================================================

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ============================================================
    // SAFE RESPONSE FORMATTER
    // ============================================================

    const safeStringify = (val) => {
        if (typeof val === "string") {
            return val;
        }

        if (typeof val === "number" || typeof val === "boolean") {
            return String(val);
        }

        if (val !== null && typeof val === "object") {
            if (Array.isArray(val)) {
                const extractedTexts = val
                    .map((item) => safeStringify(item))
                    .filter(Boolean);

                return extractedTexts.join("\n\n");
            }

            if (val.text && typeof val.text === "string") {
                return val.text;
            }

            if (val.message && typeof val.message === "string") {
                return val.message;
            }

            if (val.response && typeof val.response === "string") {
                return val.response;
            }

            if (val.content && typeof val.content === "string") {
                return val.content;
            }

            if (val.output && typeof val.output === "string") {
                return val.output;
            }

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

    // ============================================================
    // SEND MESSAGE
    // ============================================================

    const handleSend = async () => {
        const query = message.trim();

        if (!query || loading) {
            return;
        }

        // ========================================================
        // SAVE USER MESSAGE FOR UI
        // ========================================================

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: query,
            time: getCurrentTime(),
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setMessage("");
        setLoading(true);

        try {
            // ====================================================
            // CONVERT FRONTEND MESSAGES TO BACKEND HISTORY FORMAT
            // ====================================================

            const history = messages.map((msg) => ({
                role:
                    msg.sender === "user"
                        ? "user"
                        : "assistant",
                content: msg.text,
            }));

            // ====================================================
            // API REQUEST
            // ====================================================

            const response = await fetch(
                "https://doctor-booking-app-chatbot-backend-b9n01o8bp-ahmad-s-projects20.vercel.app/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: query,
                        history: history,
                    }),
                }
            );

            // ====================================================
            // CHECK RESPONSE
            // ====================================================

            if (!response.ok) {
                throw new Error(
                    `API request failed: ${response.status} `
                );
            }

            // ====================================================
            // GET JSON
            // ====================================================

            const data = await response.json();

            // ====================================================
            // EXTRACT RESPONSE
            // ====================================================

            const rawResponse =
                data.response ??
                data.message ??
                data.answer ??
                data.output ??
                data;

            const formattedText = safeStringify(rawResponse);

            // ====================================================
            // BOT MESSAGE
            // ====================================================

            const botMessage = {
                id: Date.now() + 1,
                sender: "bot",
                text:
                    formattedText ||
                    "Sorry, response empty mila.",
                time: getCurrentTime(),
            };

            setMessages((prev) => [
                ...prev,
                botMessage,
            ]);
        } catch (error) {
            console.error("Chat API Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text:
                        "Sorry! Server se response nahi aa raha. Please try again.",
                    time: getCurrentTime(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* =====================================================
                CHATBOT WINDOW
            ====================================================== */}

            <div
                className={`fixed bottom - 20 right - 4 sm: right - 6
w - [calc(100 % -2rem)] sm: w - [400px]
h - [600px] max - h - [75vh]
bg - white rounded - 2xl shadow - 2xl
                border border - gray - 200 overflow - hidden
z - [100]
                flex flex - col
transition - all duration - 300 origin - bottom - right
                ${toggle
                        ? "scale-100 opacity-100 pointer-events-auto"
                        : "scale-0 opacity-0 pointer-events-none"
                    } `}
            >
                {/* =================================================
                    HEADER
                ================================================== */}

                <div
                    className="h-16 shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600
                    px-4 flex items-center justify-between text-white"
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

                    {/* CLOSE BUTTON */}

                    <button
                        type="button"
                        onClick={() => setToggle(false)}
                        className="w-8 h-8 rounded-full
                        hover:bg-white/20
                        flex items-center justify-center
                        transition cursor-pointer"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* =================================================
                    MESSAGES BODY
                ================================================== */}

                <div
                    className="flex-1 min-h-0 overflow-y-auto
                    bg-gray-50 p-4 space-y-4"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items - start gap - 2
                            ${msg.sender === "user"
                                    ? "justify-end"
                                    : ""
                                } `}
                        >
                            {/* BOT ICON */}

                            {msg.sender === "bot" && (
                                <div
                                    className="w-8 h-8 shrink-0
                                    bg-blue-600 text-white
                                    rounded-full
                                    flex items-center justify-center
                                    mt-1"
                                >
                                    <FaRobot className="text-sm" />
                                </div>
                            )}

                            {/* MESSAGE */}

                            <div
                                className={`max - w - [80 %]
                                ${msg.sender === "user"
                                        ? "order-first"
                                        : ""
                                    } `}
                            >
                                <div
                                    className={`px - 4 py - 3
                                    ${msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                            : "bg-white border border-gray-200 shadow-sm text-gray-800 rounded-2xl rounded-tl-sm"
                                        } `}
                                >
                                    <p
                                        className="text-sm
                                        whitespace-pre-wrap
                                        leading-relaxed
                                        break-words"
                                    >
                                        {msg.text}
                                    </p>
                                </div>

                                {/* TIME */}

                                <span
                                    className={`text - [10px] text - gray - 400
mt - 1 block
                                    ${msg.sender === "user"
                                            ? "text-right mr-1"
                                            : "ml-1"
                                        } `}
                                >
                                    {msg.time}
                                </span>
                            </div>

                            {/* USER ICON */}

                            {msg.sender === "user" && (
                                <div
                                    className="w-8 h-8 shrink-0
                                    bg-gray-200 text-gray-600
                                    rounded-full
                                    flex items-center justify-center
                                    mt-1"
                                >
                                    <FaUser className="text-sm" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* =================================================
                        LOADING INDICATOR
                    ================================================== */}

                    {loading && (
                        <div className="flex items-start gap-2">
                            <div
                                className="w-8 h-8 shrink-0
                                bg-blue-600 text-white
                                rounded-full
                                flex items-center justify-center"
                            >
                                <FaRobot className="text-sm" />
                            </div>

                            <div
                                className="bg-white
                                border border-gray-200
                                shadow-sm rounded-2xl
                                rounded-tl-sm px-4 py-3"
                            >
                                <div className="flex gap-1.5 items-center">
                                    <span
                                        className="w-2 h-2
                                        bg-gray-400
                                        rounded-full
                                        animate-bounce"
                                    ></span>

                                    <span
                                        className="w-2 h-2
                                        bg-gray-400
                                        rounded-full
                                        animate-bounce
                                        [animation-delay:150ms]"
                                    ></span>

                                    <span
                                        className="w-2 h-2
                                        bg-gray-400
                                        rounded-full
                                        animate-bounce
                                        [animation-delay:300ms]"
                                    ></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AUTO SCROLL */}

                    <div ref={messagesEndRef} />
                </div>

                {/* =================================================
                    INPUT AREA
                ================================================== */}

                <div
                    className="h-16 shrink-0 bg-white
                    border-t border-gray-200 p-2.5"
                >
                    <div className="flex items-center gap-2 h-full">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSend();
                                }
                            }}
                            placeholder="Type your message..."
                            disabled={loading}
                            className="flex-1 h-10 px-4
                            text-sm bg-gray-100
                            rounded-full outline-none
                            focus:ring-2 focus:ring-blue-500
                            transition
                            disabled:opacity-50"
                        />

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={
                                loading ||
                                !message.trim()
                            }
                            className="w-10 h-10 shrink-0
                            bg-blue-600 hover:bg-blue-700
                            disabled:bg-gray-300
                            text-white rounded-full
                            flex items-center justify-center
                            transition active:scale-95
                            cursor-pointer
                            disabled:cursor-not-allowed"
                        >
                            <FaPaperPlane className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>

            {/* =====================================================
                FLOATING CHAT BUTTON
            ====================================================== */}

            <button
                type="button"
                onClick={() => setToggle((prev) => !prev)}
                aria-label={
                    toggle
                        ? "Close chatbot"
                        : "Open chatbot"
                }
                className="fixed bottom-5 right-4 sm:right-6
                w-14 h-14
                bg-gradient-to-r from-blue-600 to-indigo-600
                text-white rounded-full shadow-lg
                flex items-center justify-center
                z-[101]
                hover:scale-110
                transition-all duration-300
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

