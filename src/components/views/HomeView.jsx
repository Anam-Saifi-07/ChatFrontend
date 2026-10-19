// src/components/views/HomeView.jsx
import React, { useState } from "react";
import NavigationBar from "../layouts/NavigationBar";

const HomeView = ({
  exploreUsers = [
    { id: 101, username: "user1_name", fullName: "User1 Name" },
    { id: 102, username: "user2_name", fullName: "User2 Name" },
    { id: 103, username: "user3_name", fullName: "User3 Name" },
  ],
  circleUsers = [
    { id: 201, name: "Friend1_name", type: "DIRECT" },
    { id: 202, name: "Friend2_name", type: "DIRECT" },
    { id: 203, name: "Friend3_name", type: "ROOM" },
  ],
  onSendRequest = (id) => alert(`Connection request sent to user ID: ${id}`),
  onSelectChat = (item) => alert(`Opening chat with: ${item.name}`),
}) => {
  const [sentRequests, setSentRequests] = useState({});

  const handleSendClick = (userId) => {
    setSentRequests((prev) => ({ ...prev, [userId]: true }));
    onSendRequest(userId);
  };

  return (
    <>
      <div className="container-fluid py-3" style={{ height: "80vh" }}>
        <div className="row h-100 g-3">
          {/* Left Column: EXPLORE */}
          <div className="col-md-6 d-flex flex-column">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-header bg-primary text-white fw-bold d-flex align-items-center justify-content-between">
                <span>EXPLORE</span>
                <small className="text-white-50">Find New Users</small>
              </div>
              <div className="card-body overflow-auto p-2">
                {exploreUsers.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <p className="m-0">No new users to explore right now.</p>
                  </div>
                ) : (
                  exploreUsers.map((user) => {
                    const isSent = sentRequests[user.id];
                    return (
                      <div
                        key={user.id}
                        className="d-flex justify-content-between align-items-center p-3 border-bottom"
                      >
                        <div>
                          <h6 className="m-0 fw-bold">{user.fullName}</h6>
                          <small className="text-muted">@{user.username}</small>
                        </div>
                        <button
                          onClick={() => handleSendClick(user.id)}
                          disabled={isSent}
                          className={`btn btn-sm d-flex align-items-center gap-1 shadow-sm ${
                            isSent
                              ? "btn-success text-white"
                              : "btn-outline-primary"
                          }`}
                        >
                          {isSent ? "✓ Requested" : "+ Send Request"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: YOUR CIRCLE */}
          <div className="col-md-6 d-flex flex-column">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-header bg-success text-white fw-bold d-flex align-items-center justify-content-between">
                <span>YOUR CIRCLE</span>
                <small className="text-white-50">Active Friends & Rooms</small>
              </div>
              <div className="card-body overflow-auto p-2">
                {circleUsers.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <p className="m-0">
                      Your circle is empty. Connect with someone from Explore!
                    </p>
                  </div>
                ) : (
                  circleUsers.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectChat(item)}
                      className="d-flex justify-content-between align-items-center p-3 border-bottom rounded transition-hover"
                      style={{ cursor: "pointer", backgroundColor: "#f8f9fa" }}
                    >
                      <div>
                        <h6 className="m-0 fw-bold text-dark">{item.name}</h6>
                        <small className="badge bg-secondary text-light mt-1">
                          {item.type === "ROOM" ? "Room Chat" : "Direct Chat"}
                        </small>
                      </div>
                      <button className="btn btn-sm btn-primary d-flex align-items-center gap-1 shadow-sm">
                        💬 Chat
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavigationBar></NavigationBar>
    </>
  );
  
    
};

export default HomeView;
