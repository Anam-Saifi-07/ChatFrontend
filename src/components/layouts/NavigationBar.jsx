import { useState, useContext } from "react";
import { toast } from "react-toastify";
import styles from "../layouts/NavigationBar.module.css";
import { UserContext } from "../../context/ChatContext";
import { createRoomService } from "../../Services/RoomService";

function NavigationBar({ activeTab = "home", onTabChange = () => {} }) {
  const tabs = [
    { id: "home", name: "home" },
    { id: "person", name: "person" },
    { id: "room", name: "room" },
    { id: "profile", name: "profile" },
    { id: "create", name: "create" },
  ];

  const [showCreateInput, setShowCreateInput] = useState(false);
  const [name, setName] = useState("");

  const { userDetails } = useContext(UserContext);

  function handleCreate() {
    setShowCreateInput(!showCreateInput);
  }

  async function submitRoom() {
    if (!name.trim()) {
      return toast.error("Room name required!");
    }
    try {
      const roomDetails = {
        name: name.trim(),
        isGroup: true,
        memberIds: [userDetails.id],
      };
      const response = await createRoomService(roomDetails);
      console.log(response);
      toast.success("Room created successfully...");
      setName("");
      setShowCreateInput(false);
    } catch (error) {
      console.log(error.response);
      toast.error("Room create failed!");
    }
  }

  function handleInputKeyDown(event) {
    if (event.key === "Enter") {
      submitRoom();
    }
  }

  return (
    <>
      {showCreateInput && (
        <div
          style={{
            maxWidth: "20rem",
            width: "100%",
            margin: "0 auto",
            padding: "10px",
            backgroundColor: "rgb(22, 81, 103)",
          }}
        >
          <input
            type="text"
            placeholder="Enter Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleInputKeyDown}
            style={{ width: "70%" }}
          />
          <button
            styles={{ color: "rgb(22, 81, 103)" }}
            onClick={submitRoom}
          ></button>
        </div>
      )}

      <div
        className={`btn-group btn-group-toggle ${styles.centreToggle}`}
        data-toggle="buttons"
      >
        {tabs.map((tab) => {
          if (tab.id === "create") {
            if (activeTab !== "room") return null;
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
    </>
  );
}

export default NavigationBar;
