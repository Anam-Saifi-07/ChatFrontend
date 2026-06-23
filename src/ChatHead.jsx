import "bootstrap/dist/css/bootstrap.min.css";
import "./Chat.css";
import useMyChatContext from "./context/ChatContext";
import { useNavigate } from "react-router";
function ChatHead() {
  const { roomOwner, roomId, connected, setConnected, currentUser,serCurrentUser } =
    useMyChatContext();
  const navigate = useNavigate();
  const leaveHandler = () => {
    if (connected) {
      setConnected(false);
      navigate("/");  
    }
  }
  return (
    <>
      <div className="container text-center ">
        <div className="row abc">
          <div className="col xyz">RoomID: { roomId}</div>
          <div className="col-8 xyz">User Name: { currentUser}</div>
          <div className="col">
            <button onClick={leaveHandler} type="button" className="btn btn-danger chatbtn" >
              Leave
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ChatHead;
