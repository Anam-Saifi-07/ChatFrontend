import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./NavigationBar.module.css";
import { UserContext } from "../../context/ChatContext";
import { createRoomService } from "../../Services/RoomService";

function NavigationBar({
  activeTab = "home",
  onTabChange = () => {},
  isChatOpen = false,
}) {
  // Navigation tabs with icons
  const tabs = [
    { id: "home", label: "Home", icon: "bi-house-door-fill" },
    { id: "person", label: "Person", icon: "bi-person-fill" },
    { id: "room", label: "Room", icon: "bi-people-fill" },
    { id: "profile", label: "Profile", icon: "bi-person-badge-fill" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { userDetails } = useContext(UserContext);

  // Close menus when tab changes or chat opens
  useEffect(() => {
    setIsOpen(false);
    setShowCreateInput(false);
    setName("");
  }, [activeTab, isChatOpen]);

  // Handle Escape key to close expanded navigation or create modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showCreateInput) {
          setShowCreateInput(false);
          setName("");
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCreateInput, isOpen]);

  // Requirement: Do not display navigation on the chat page
  if (isChatOpen) {
    return null;
  }

  const activeTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  function handleTabClick(tabId) {
    onTabChange(tabId);
    setIsOpen(false);
  }

  function handleCreateClick() {
    setIsOpen(false);
    setShowCreateInput(true);
  }

  function handleCancelModal() {
    setShowCreateInput(false);
    setName("");
  }

  function handleModalBackdropClick(e) {
    if (e.target === e.currentTarget) {
      handleCancelModal();
    }
  }

  async function submitRoom() {
    if (!name.trim()) {
      return toast.error("Room name required!");
    }
    try {
      setIsSubmitting(true);
      const roomDetails = {
        name: name.trim(),
        isGroup: true,
        memberIds: userDetails?.id ? [userDetails.id] : [],
      };
      await createRoomService(roomDetails);
      toast.success("Room created successfully...");
      setName("");
      setShowCreateInput(false);
    } catch (error) {
      console.error("Room create failed", error);
      toast.error("Room create failed!");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitRoom();
    }
  }

  return (
    <>
      {/* Dim backdrop when circular menu is expanded */}
      {isOpen && (
        <div
          className={styles.navBackdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Circular Navigation Widget */}
      <nav className={styles.navWrapper} aria-label="Main Navigation">
        {/* Expanded Island Dock showing all tabs */}
        {isOpen && (
          <div className={styles.expandedDock} role="tablist">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.tabItem} ${isActive ? styles.tabItemActive : ""}`}
                  onClick={() => handleTabClick(tab.id)}
                  title={tab.label}
                >
                  <i className={`bi ${tab.icon} ${styles.tabIcon}`}></i>
                  <span className={styles.tabLabel}>{tab.label}</span>
                </button>
              );
            })}

            {/* Create Room Tab (Visible only when on Room tab) */}
            {activeTab === "room" && (
              <button
                type="button"
                className={`${styles.tabItem} ${styles.createTabItem}`}
                onClick={handleCreateClick}
                title="Create New Room"
              >
                <i className={`bi bi-plus-lg ${styles.tabIcon}`}></i>
                <span className={styles.tabLabel}>Create</span>
              </button>
            )}
          </div>
        )}

        {/* Circular Floating Trigger (Click on it -> opens all tabs) */}
        <button
          type="button"
          className={`${styles.circleTrigger} ${isOpen ? styles.circleTriggerOpen : ""}`}
          onClick={toggleOpen}
          title={isOpen ? "Close navigation" : `Current: ${activeTabObj.label} (Click to open tabs)`}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation" : "Open navigation tabs"}
        >
          <span className={styles.activeBadge} />
          <i
            className={`bi ${isOpen ? "bi-x-lg" : activeTabObj.icon} ${styles.triggerIcon}`}
          ></i>
        </button>
      </nav>

      {/* Create Room Modal */}
      {showCreateInput && activeTab === "room" && (
        <div
          className={styles.modalOverlay}
          onClick={handleModalBackdropClick}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={styles.createCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h5 className={styles.modalTitle}>
                <i className={`bi bi-plus-circle ${styles.modalTitleIcon}`}></i>
                Create New Room
              </h5>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleCancelModal}
                aria-label="Close"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="modalRoomNameInput" className={styles.inputLabel}>
                Room Name
              </label>
              <input
                id="modalRoomNameInput"
                type="text"
                className={styles.roomInput}
                placeholder="Enter room name..."
                value={name}
                autoFocus
                disabled={isSubmitting}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancelModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.createBtn}
                onClick={submitRoom}
                disabled={isSubmitting}
              >
                <i className="bi bi-check-lg"></i>
                {isSubmitting ? "Creating..." : "Create Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavigationBar;
