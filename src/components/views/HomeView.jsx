// src/components/views/HomeView.jsx
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./PersonHomeView.module.css";
import {
  exploreNewGroupService,
  sendGroupRequestService,
  getAllGroupsOfCurrentUserService,
} from "../../Services/RoomService";

const HomeView = ({
  onSendRequest = (id) => alert(`Join request sent for room: ${id}`),
  onSelectChat = (room) => alert(`Opening group: ${room.name}`),
}) => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [sentGroupReqs, setSentGroupReqs] = useState({});

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const [exploreRes, myRes] = await Promise.all([
          exploreNewGroupService(),
          getAllGroupsOfCurrentUserService(),
        ]);
        if (ignore) return;
        console.log("explore:", exploreRes.data);
        console.log("myGroups:", myRes.data); // check id / name field
        setGroups(exploreRes.data ?? []);
        setMyGroups(myRes.data ?? []);
      } catch (error) {
        console.log("Failed to fetch groups:", error);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleJoinGroup = async (roomId) => {
    try {
      await sendGroupRequestService(roomId);
      setSentGroupReqs((prev) => ({ ...prev, [roomId]: true }));
      onSendRequest(roomId);
    } catch (error) {
      console.log("Failed to send join request:", error);
      alert("Failed to send join request. Try again.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.headerTitle}>
              <i className="bi bi-collection"></i>
              <span>EXPLORE</span>
            </span>
            <small className={styles.headerSub}>Find New Groups</small>
          </div>
          <div className={styles.list}>
            {groups.length === 0 ? (
              <p className={styles.emptyText}>
                No groups to explore right now.
              </p>
            ) : (
              groups.map((g) => {
                const sent = sentGroupReqs[g.id];
                return (
                  <div key={g.id} className={styles.rowItem}>
                    <div className={styles.avatar}>
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <div className={styles.rowText}>
                      <span className={styles.name}>{g.name}</span>
                      <span className={styles.tag}>Group</span>
                    </div>
                    <button
                      onClick={() => handleJoinGroup(g.id)}
                      disabled={sent}
                      className={sent ? styles.sentBtn : styles.sendBtn}
                    >
                      {sent ? "✓ Requested" : "+ Join Group"}
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
            <small className={styles.headerSub}>Groups You Joined</small>
          </div>
          <div className={styles.list}>
            {myGroups.length === 0 ? (
              <p className={styles.emptyText}>
                No groups yet. Join one from Explore!
              </p>
            ) : (
              myGroups.map((g) => (
                <div
                  key={g.id}
                  className={styles.rowItem}
                  onClick={() => onSelectChat({ id: g.id, name: g.name })}
                >
                  <div className={styles.avatar}>
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className={styles.rowText}>
                    <span className={styles.name}>{g.name}</span>
                    <span className={styles.tag}>Group Chat</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChat({ id: g.id, name: g.name });
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

export default HomeView;
