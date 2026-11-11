import { useState } from "react";
import styles from "./MainLayout.module.css";
import NavigationBar from "./NavigationBar";
import HomeView from "../views/HomeView";
import PersonHomeView from "../views/PersonHomeView";
import { ProfileView } from "../views/ProfileView";
import ChatView from "../views/ChatView";

const PlaceholderView = ({ title }) => (
  <div className="d-flex align-items-center justify-content-center h-100">
    <h1 className="text-muted">{title}</h1>
  </div>
);

function MainLayout() {
  // initial active view = home (registration/login ke baad yahin land hota hai)
  const [activeTab, setActiveTab] = useState("home");
  // jab chat button click ho -> {id, name} ; null = chat band
  const [openChat, setOpenChat] = useState(null);

  const handleTabChange = (tab) => {
    setOpenChat(null); // naye tab par chat band ho jaye
    setActiveTab(tab);
  };

  const handleSelectChat = (room) => setOpenChat(room); // room = {id, name}

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return <PlaceholderView title="Home Section"/>;
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
      {/* key forces full remount -> purana view completely unmount ho jata hai */}
      <main className={styles.content} key={activeTab}>
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

      <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default MainLayout;
