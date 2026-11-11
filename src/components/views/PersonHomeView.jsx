// src/components/views/PersonHomeView.jsx
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./PersonHomeView.module.css";
import {
  getAllNewUserService,
  sendPersonalRequestService,
  getAllPesonalChatsService,
} from "../../Services/RoomService";

const PersonHomeView = ({
  onSendRequest = (id) => alert(`Connection request sent to user ID: ${id}`),
  onSelectChat = (room) => alert(`Opening chat with: ${room.name}`),
}) => {
  const [exploreUsers, setExploreUsers] = useState([]);
  const [circleUsers, setCircleUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState({});

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [exploreRes, circleRes] = await Promise.all([
          getAllNewUserService(),
          getAllPesonalChatsService(),
        ]);
        if (ignore) return;
        console.log("explore:", exploreRes.data);
        console.log("circle:", circleRes.data);
        setExploreUsers(exploreRes.data ?? []);
        setCircleUsers(circleRes.data ?? []);
      } catch (error) {
        console.log("Failed to fetch users:", error);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // const handleSendClick = (userId) => {
  //   setSentRequests((prev) => ({ ...prev, [userId]: true }));
  //   onSendRequest(userId);
  // };

  const handleSendClick = async (userId) => {
    try {
      const response = await sendPersonalRequestService(userId);
      console.log(response);
      setSentRequests((prev) => ({ ...prev, [userId]: true }));
      onSendRequest(userId);
    } catch (error) {
      console.log("Failed to send request:", error);
      alert("Failed to send request. Try again.");
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {/* Left Column: EXPLORE */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.headerTitle}>
              <i className="bi bi-compass"></i>
              <span>EXPLORE</span>
            </span>
            <small className={styles.headerSub}>Find New Users</small>
          </div>
          <div className={styles.list}>
            {exploreUsers.length === 0 ? (
              <p className={styles.emptyText}>
                No new users to explore right now.
              </p>
            ) : (
              exploreUsers.map((user) => {
                const isSent = sentRequests[user.id];
                return (
                  <div key={user.id} className={styles.rowItem}>
                    <div className={styles.avatar}>
                      {(user.fullName || "?").charAt(0)}
                    </div>
                    <div className={styles.rowText}>
                      <span className={styles.name}>{user.fullName}</span>
                      <span className={styles.handle}>@{user.name}</span>
                    </div>
                    <button
                      onClick={() => handleSendClick(user.id)}
                      disabled={isSent}
                      className={isSent ? styles.sentBtn : styles.sendBtn}
                    >
                      {isSent ? "✓ Requested" : "+ Send Request"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: YOUR CIRCLE */}
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.headerTitle}>
              <i className="bi bi-people"></i>
              <span>YOUR CIRCLE</span>
            </span>
            <small className={styles.headerSub}>Active Friends & Rooms</small>
          </div>
          <div className={styles.list}>
            {circleUsers.length === 0 ? (
              <p className={styles.emptyText}>
                Your circle is empty. Connect with someone from Explore!
              </p>
            ) : (
              circleUsers.map((item) => (
                <div
                  key={item.room.id}
                  onClick={() =>
                    onSelectChat({ id: item.room.id, name: item.name })
                  }
                  className={styles.rowItem}
                >
                  <div className={styles.avatar}>
                    {(item.name || "?").charAt(0)}
                  </div>
                  <div className={styles.rowText}>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.tag}>
                      {item.room.name === "" ? item.person.name : item.room.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChat({ id: item.room.id, name: item.person.name }); //open chat view of that room
                    }}
                    className={styles.chatBtn}
                  >
                    <i className="bi bi-chat-dots-fill"></i> Chat
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PersonHomeView;
