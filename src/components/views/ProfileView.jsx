import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./ProfileView.module.css";
import { UserContext, Tokencontext, initialUser } from "../../context/ChatContext";
import {
  getOtherPersonalRequestService,
  personalRequestByMeService,
  acceptRequestService,
  rejectRequestService,
} from "../../Services/RoomService";
import { toast } from "react-toastify";

export function ProfileView() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { setToken } = useContext(Tokencontext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUserDetails(initialUser);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/joinRoom", { replace: true });
  };
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const metaFields = [
    {
      key: "gender",
      label: "Gender",
      icon: "bi-person-badge",
      value: userDetails.gender,
    },
    {
      key: "age",
      label: "Age",
      icon: "bi-calendar-heart",
      value: userDetails.age,
    },
    {
      key: "phoneNo",
      label: "Phone No",
      icon: "bi-telephone",
      value: userDetails.phoneNo,
    },
    {
      key: "mail",
      label: "Email",
      icon: "bi-envelope",
      value: userDetails.mail,
    },
  ];

  const fetchRequests = async () => {
    try {
      const res = await getOtherPersonalRequestService();
      console.log(res.data)
      setRequests(res.data ?? []);

      const sentRes = await personalRequestByMeService();
      setSentRequests(sentRes.data ?? []);
    } catch (error) {
      console.log("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const response = await acceptRequestService(requestId);
      toast.success(response.data.status);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.log("Failed to accept:", error);
      alert("Failed to accept request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequestService(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.log("Failed to reject:", error);
      alert("Failed to reject request.");
    }
  };

  return (
    <div className={styles.profileContainer}>
      {/* 1. Profile Details Section */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {(userDetails.name || "?").charAt(0)}
        </div>
        <h3 className={styles.userName}>
          {userDetails.name || "Unknown User"}
        </h3>
        <p className={styles.userId}>@{userDetails.id || "no-id"}</p>

        <div className={styles.userMeta}>
          {metaFields.map((field) => (
            <div key={field.key} className={styles.metaItem}>
              <i className={`bi ${field.icon} ${styles.metaIcon}`}></i>
              <span className={styles.metaLabel}>{field.label}</span>
              <span className={styles.metaValue} title={field.value || ""}>
                {field.value || "-"}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i> Log Out
        </button>
      </div>

      {/* 2. Requests Section Container */}
      <div className={styles.requestsContainer}>
        <h5 className={styles.sectionTitle}>
          <i className={`bi bi-inbox ${styles.sectionTitleIcon}`}></i>
          Requests
        </h5>

        {loading ? (
          <p className={styles.noRequestsText}>Loading...</p>
        ) : requests.length === 0 ? (
          <p className={styles.noRequestsText}>
            <i className="bi bi-envelope-open me-2"></i>
            No requests to display right now.
          </p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className={styles.requestItem}>
              <div className={styles.requestAvatar}>
                {(req.name || req.senderName || "?").charAt(0)}
              </div>
              <div className={styles.requestInfo}>
                <span className={styles.requestName}>
                  {req.name || req.senderName || "Unknown User"}
                </span>
                <span className={styles.requestId}>
                  @{req.senderId || req.id}
                </span>
              </div>
              <div className={styles.requestActions}>
                <button
                  className={styles.acceptBtn}
                  onClick={() => handleAccept(req.id)}
                >
                  <i className="bi bi-check-lg"></i> Accept
                </button>
                <button
                  className={styles.rejectBtn}
                  onClick={() => handleReject(req.id)}
                >
                  <i className="bi bi-x-lg"></i> Reject
                </button>
              </div>
            </div>
          ))
        )}

        <h5 className={styles.sectionTitle}>
          <i className={`bi bi-send ${styles.sectionTitleIcon}`}></i>
          Sent Requests
        </h5>

        {loading ? (
          <p className={styles.noRequestsText}>Loading...</p>
        ) : sentRequests.length === 0 ? (
          <p className={styles.noRequestsText}>
            <i className="bi bi-send me-2"></i>
            No sent requests right now.
          </p>
        ) : (
          sentRequests.map((req) => (
            <div key={req.id} className={styles.requestItem}>
              <div className={styles.requestAvatar}>
                {(req.senderName || "?").charAt(0)}
              </div>
              <div className={styles.requestInfo}>
                <span className={styles.requestName}>
                  {req.senderName || "Unknown User"}
                </span>
                <span className={styles.requestId}>
                  @{req.receiverId || req.id}
                </span>
              </div>
              <div className={styles.requestActions}>
                <span className={styles.requestId}>{req.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
