import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styles from "./ChatView.module.css";
import useMyChatContext, { UserContext } from "../../context/ChatContext";
import useMySocketContext from "../../context/WebSocketContext";
import { getRoomMessagesService } from "../../Services/RoomService";
import {
  connectChatSocket,
  disconnectChatSocket,
  sendRoomMessage,
  subscribeToRoom,
} from "../../Services/ChatSocketService";

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

    getRoomMessagesService(roomId)
      .then((res) => {
        if (cancelled) return;
        setMessages((prev) => {
          const fetchedIds = new Set(res.data.map((m) => m.id));
          const liveOnly = prev.filter((m) => !fetchedIds.has(m.id));
          return [...res.data, ...liveOnly];
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
      {/* Chat Header (v1 ChatHead pattern) */}
      <div className={styles.chatHeader}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <span title={roomId}>Chat with {recipientName}</span>
      </div>

      {/* Messages Scroll Area */}
      <div className={styles.messagesArea}>
        {messages.map((msg) => {
          const isMe = msg.senderId === userDetails?.id;
          return (
            <div
              key={msg.id}
              title={msg.senderUsername}
              className={`${styles.messageBubble} ${
                isMe ? styles.outgoing : styles.incoming
              }`}
            >
              {!isMe && (
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>
                  {msg.senderUsername}
                </div>
              )}
              {msg.content}
            </div>
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
