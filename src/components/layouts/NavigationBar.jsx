import styles from "../layouts/NavigationBar.module.css";

function NavigationBar({ activeTab = "home", onTabChange = () => {} }) {
  const tabs = [
    { id: "home", name: "home" },
    { id: "person", name: "person" },
    { id: "room", name: "room" },
    { id: "profile", name: "profile" },
    { id: "create", name: "create" },
  ];

  function handleCreate() {
    // Yahan create modal open karne ki logic aayegi
  }

  return (
    <div
      className={`btn-group btn-group-toggle ${styles.centreToggle}`}
      data-toggle="buttons"
    >
      {tabs.map((tab) => {
        // create button sirf 'person' ya 'room' tab par dikhega
        if (tab.id === "create") {
          if (activeTab !== "person" && activeTab !== "room") return null;
          return (
            <label key={tab.id} className="btn">
              <button className={`${styles.btn}`} onClick={handleCreate}>
                {tab.name}
              </button>
            </label>
          );
        }

        return (
          <label
            key={tab.id}
            className={`btn ${activeTab === tab.id ? "active" : ""}`}
          >
            <button
              className={`${styles.btn}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.name}
            </button>
          </label>
        );
      })}
    </div>
  );
}

export default NavigationBar;
