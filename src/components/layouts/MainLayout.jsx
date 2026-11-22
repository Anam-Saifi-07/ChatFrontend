import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import styles from "./MainLayout.module.css";
import NavigationBar from "./NavigationBar";
import HomeView from "../views/HomeView";
import PersonHomeView from "../views/PersonHomeView";
import { ProfileView } from "../views/ProfileView";
import ChatView from "../views/ChatView";
import { UserContext, Tokencontext, initialUser } from "../../context/ChatContext";
import ThemeToggle from "../common/ThemeToggle";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";

// Polished Home Dashboard View matching the design system
const HomeDashboardView = ({ onNavigate = () => {}, userName = "User" }) => (
  <div className={styles.dashboardContainer}>
    {/* Welcome Hero Banner */}
    <div className={styles.heroBanner}>
      <h1 className={styles.heroGreeting}>Welcome back, {userName}! 👋</h1>
      <p className={styles.heroSub}>
        Connect with friends in real-time, join group discussions, and manage your chats with seamless real-time messaging.
      </p>
    </div>

    {/* Quick Navigation Cards */}
    <div className={styles.cardsGrid}>
      {/* People / Direct Chats Card */}
      <div
        className={styles.featureCard}
        onClick={() => onNavigate("person")}
        role="button"
        tabIndex={0}
      >
        <div className={`${styles.cardIconBox} ${styles.blueIcon}`}>
          <i className="bi bi-people-fill"></i>
        </div>
        <h3 className={styles.cardTitle}>Direct Chats</h3>
        <p className={styles.cardDesc}>
          Explore active users, send direct connection requests, and chat one-on-one with your circle.
        </p>
        <span className={styles.cardAction}>
          Open People <i className="bi bi-arrow-right"></i>
        </span>
      </div>

      {/* Group Rooms Card */}
      <div
        className={styles.featureCard}
        onClick={() => onNavigate("room")}
        role="button"
        tabIndex={0}
      >
        <div className={`${styles.cardIconBox} ${styles.purpleIcon}`}>
          <i className="bi bi-collection-fill"></i>
        </div>
        <h3 className={styles.cardTitle}>Group Rooms</h3>
        <p className={styles.cardDesc}>
          Discover public chat rooms, join exciting group conversations, or create your own custom room.
        </p>
        <span className={styles.cardAction}>
          Explore Rooms <i className="bi bi-arrow-right"></i>
        </span>
      </div>

      {/* Profile & Requests Card */}
      <div
        className={styles.featureCard}
        onClick={() => onNavigate("profile")}
        role="button"
        tabIndex={0}
      >
        <div className={`${styles.cardIconBox} ${styles.greenIcon}`}>
          <i className="bi bi-person-badge-fill"></i>
        </div>
        <h3 className={styles.cardTitle}>My Profile</h3>
        <p className={styles.cardDesc}>
          View your profile details, accept or reject incoming requests, and track pending invitations.
        </p>
        <span className={styles.cardAction}>
          View Profile <i className="bi bi-arrow-right"></i>
        </span>
      </div>
    </div>
  </div>
);

function MainLayout() {
  const [activeTab, setActiveTab] = useState("home");
  const [openChat, setOpenChat] = useState(null);
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

  const handleTabChange = (tab) => {
    setOpenChat(null);
    setActiveTab(tab);
  };

  const handleSelectChat = (room) => setOpenChat(room);

  const tabLabels = {
    home: "Home",
    person: "People & Chats",
    room: "Group Rooms",
    profile: "Profile & Requests",
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeDashboardView
            onNavigate={handleTabChange}
            userName={userDetails?.name || "Friend"}
          />
        );
      case "profile":
        return <ProfileView />;
      case "person":
        return <PersonHomeView onSelectChat={handleSelectChat} />;
      case "room":
        return <HomeView onSelectChat={handleSelectChat} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      {/* Top Header: Rendered only on non-chat views */}
      {!openChat && (
        <header className={styles.topHeader}>
          <div className={styles.brandArea}>
            <div className={styles.brandIcon}>
              <i className="bi bi-chat-dots-fill"></i>
            </div>
            <h2 className={styles.brandText}>ChatHub</h2>
            <span className={styles.tabBadge}>{tabLabels[activeTab] || activeTab}</span>
          </div>

          <div className={styles.headerActions}>
            <ThemeToggle showLabel={false} />
            <div
              className={styles.userBadge}
              onClick={() => handleTabChange("profile")}
              title="View Profile"
            >
              <div className={styles.userAvatar}>
                {(userDetails?.name || "?").charAt(0).toUpperCase()}
              </div>
              <span className={styles.userNameText}>{userDetails?.name || "User"}</span>
            </div>
            <button
              type="button"
              className={styles.logoutHeaderBtn}
              onClick={handleLogout}
              title="Log Out"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={styles.content} key={activeTab + (openChat ? `_chat_${openChat.id}` : "")}>
        {openChat ? (
          <ChatView
            roomId={openChat.id}
            recipientName={openChat.name}
            onBack={() => setOpenChat(null)}
          />
        ) : (
          renderActiveView()
        )}
      </main>

      {/* Navigation Dock: Rendered only when not in chat */}
      <NavigationBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isChatOpen={Boolean(openChat)}
      />
    </div>
  );
}

export default MainLayout;
