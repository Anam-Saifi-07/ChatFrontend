import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styles from "./ChatView.module.css";
import useMyChatContext, { UserContext } from "../../context/ChatContext";
import useMySocketContext from "../../context/WebSocketContext";
import {
  connectChatSocket,
  disconnectChatSocket,
  fetchRoomMessages,
  sendRoomMessage,
  subscribeToRoom,
} from "../../Services/ChatSocketService";

// Robust date parser supporting ISO strings, epoch ms, and Jackson [year, month, day, hour, min, sec] arrays
function parseMessageDate(val) {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (Array.isArray(val)) {
    // Jackson array: [year, month, day, hour, min, sec, nanos] (month is 1-based in Java)
    const [year, month, day, hour = 0, minute = 0, second = 0] = val;
    return new Date(year, (month || 1) - 1, day || 1, hour, minute, second);
  }
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
    // Clean potential microsecond/nanosecond string (e.g. .123456789)
    const cleaned = String(val).replace(/(\.\d{3})\d+/, "$1");
    const d2 = new Date(cleaned);
    if (!isNaN(d2.getTime())) return d2;
  }
  return new Date();
}

function getDateKey(val) {
  const d = parseMessageDate(val);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function formatDateDivider(val) {
  const d = parseMessageDate(val);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const dKey = getDateKey(d);
  if (dKey === getDateKey(today)) return "Today";
  if (dKey === getDateKey(yesterday)) return "Yesterday";

  return d.toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMessageDateTime(val) {
  const dateObj = parseMessageDate(val);
  const currentYear = new Date().getFullYear();
  const msgYear = dateObj.getFullYear();

  const timeStr = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dateOptions = {
    day: "numeric",
    month: "short",
    ...(msgYear !== currentYear ? { year: "numeric" } : {}),
  };

  const dateStr = dateObj.toLocaleDateString([], dateOptions);
  return `${dateStr}, ${timeStr}`;
}

function formatTooltipDateTime(val) {
  const dateObj = parseMessageDate(val);
  return dateObj.toLocaleString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function ChatView({
  roomId,
  recipientName = "User_name",
  onBack = () => {},
}) {
  const { userDetails } = useContext(UserContext);
  const { connected, setConnected } = useMyChatContext();
  const { stompClient, setStompClient } = useMySocketContext();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef(null);

  // reset messages when room changes
  const [loadedRoomId, setLoadedRoomId] = useState(roomId);
  if (loadedRoomId !== roomId) {
    setLoadedRoomId(roomId);
    setMessages([]);
  }

  // 1. socket connection (v1 Chat.jsx pattern -> shared WebSocketContext)
  useEffect(() => {
    let cancelled = false;
    const client = connectChatSocket(
      () => {
        if (cancelled) {
          disconnectChatSocket(client);
          return;
        }
        setStompClient(client);
        setConnected(true);
      },
      (err) => {
        console.error("Socket connection failed", err);
        toast.error("Not Connected");
      },
    );

    return () => {
      cancelled = true;
      setConnected(false);
      setStompClient(null);
      disconnectChatSocket(client);
    };
  }, [setStompClient, setConnected]);

  // 2. fetch message history when connected (v1 ChatBody pattern)
  useEffect(() => {
    if (!connected || !roomId) return;
    let cancelled = false;

    fetchRoomMessages(roomId)
      .then((data) => {
        if (cancelled) return;
        setMessages((prev) => {
          const fetchedIds = new Set(data.map((m) => m.id));
          const liveOnly = prev.filter((m) => !fetchedIds.has(m.id));
          return [...data, ...liveOnly];
        });
      })
      .catch((err) => console.error("Failed to load messages", err));

    return () => {
      cancelled = true;
    };
  }, [connected, roomId]);

  // 3. subscribe to room topic, cleanup on room change (v1 ChatBody pattern)
  useEffect(() => {
    if (!connected || !stompClient || !roomId) return;

    const subscription = subscribeToRoom(stompClient, roomId, (msg) => {
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [connected, stompClient, roomId]);

  // 4. auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 5. send with guards + toasts (v1 ChatBottom pattern)
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!stompClient || !stompClient.connected) {
      toast.error("Not Connected");
      return;
    }
    const content = inputText.trim();
    if (!content) {
      toast.info("Type Your Message...");
      return;
    }

    sendRoomMessage(stompClient, roomId, content);
    setInputText("");
  };

  return (
    <div className={styles.chatContainer}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <span className={styles.headerTitle} title={roomId}>
          Chat with {recipientName}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className={styles.messagesArea}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <i className="bi bi-chat-dots" />
            <p>No messages yet. Send a message to start the conversation!</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.senderId === userDetails?.id;
          const msgDate = parseMessageDate(msg.createdAt);
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const showDateDivider =
            index === 0 ||
            getDateKey(msgDate) !== getDateKey(prevMsg?.createdAt);

          return (
            <React.Fragment key={msg.id ? String(msg.id) : `msg_${index}`}>
              {showDateDivider && (
                <div className={styles.dateDivider}>
                  <span className={styles.dateDividerBadge}>
                    {formatDateDivider(msgDate)}
                  </span>
                </div>
              )}
              <div
                title={msg.senderUsername}
                className={`${styles.messageBubble} ${
                  isMe ? styles.outgoing : styles.incoming
                }`}
              >
                {!isMe && (
                  <div className={styles.senderName}>
                    {msg.senderUsername || "User"}
                  </div>
                )}
                <div className={styles.messageContent}>
                  {msg.content}
                </div>
                <div
                  className={`${styles.messageMeta} ${
                    isMe ? styles.metaOutgoing : styles.metaIncoming
                  }`}
                  title={formatTooltipDateTime(msg.createdAt)}
                >
                  <i className={`bi bi-clock ${styles.metaClockIcon}`} />
                  <span>{formatMessageDateTime(msg.createdAt)}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Bottom Input Form */}
      <form className={styles.inputArea} onSubmit={handleSendMessage}>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatView;
