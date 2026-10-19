import { useContext } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./ProfileView.module.css";
import { UserContext } from "../../context/ChatContext";

export function ProfileView() {
  const { userDetails } = useContext(UserContext);

  const metaFields = [
    { key: "gender", label: "Gender", icon: "bi-person-badge", value: userDetails.gender },
    { key: "age", label: "Age", icon: "bi-calendar-heart", value: userDetails.age },
    { key: "phoneNo", label: "Phone No", icon: "bi-telephone", value: userDetails.phoneNo },
    { key: "mail", label: "Email", icon: "bi-envelope", value: userDetails.mail },
  ];

  return (
    <div className={styles.profileContainer}>
      {/* 1. Profile Details Section */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {(userDetails.name || "?").charAt(0)}
        </div>
        <h3 className={styles.userName}>{userDetails.name || "Unknown User"}</h3>
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
      </div>

      {/* 2. Requests Section Container */}
      <div className={styles.requestsContainer}>
        <h5 className={styles.sectionTitle}>
          <i className={`bi bi-inbox ${styles.sectionTitleIcon}`}></i>
          Requests
        </h5>

        {/* TODO: Request accept and deny section will be implemented here later */}
        <p className={styles.noRequestsText}>
          <i className="bi bi-envelope-open me-2"></i>
          No requests to display right now.
        </p>
      </div>
    </div>
  );
}
