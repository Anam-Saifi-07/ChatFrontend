import { useState } from "react";
import styles from "./MainLayout.module.css";
import NavigationBar from "./NavigationBar";
import HomeView from "../views/HomeView";
import { ProfileView } from "../views/ProfileView";

const PlaceholderView = ({ title }) => (
  <div className="d-flex align-items-center justify-content-center h-100">
    <h1 className="text-muted">{title}</h1>
  </div>
);

function MainLayout() {
  // initial active view = home (registration/login ke baad yahin land hota hai)
  const [activeTab, setActiveTab] = useState("home");

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return <PlaceholderView title="Home Section"/>;
      case "profile":
        return <ProfileView />;
      case "person":
        return <HomeView></HomeView>;
      case "room":
        return <HomeView></HomeView>
      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      {/* key forces full remount -> purana view completely unmount ho jata hai */}
      <main className={styles.content} key={activeTab}>
        {renderActiveView()}
      </main>

      <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default MainLayout;
