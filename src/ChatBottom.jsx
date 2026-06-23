import { useState } from "react";
import "./Chat.css";
import "bootstrap-icons/font/bootstrap-icons.css"
import useMyChatContext from "./context/ChatContext";
import useMySocketContext from "./context/WebSocketContext";
import { toast } from "react-toastify";
function ChatBottom() {
  const {connected,roomId,currentUser,setCurrentUser } = useMyChatContext();
  const { stompClient, setStompClient } = useMySocketContext();
  const [msg, setMsg] = useState("");
  const sendBtnHandler = () => {
     if (!stompClient || !stompClient.connected) {
       toast.error("Not Connected");
       return;
     }
    if (connected) {
      // can send msg to  /chat/{roomId} and msg send with content and personId
      if (msg === "") {
        toast.info("Type Your Message...");
        return;
      }
      stompClient.send(
        `/app/chat/${roomId}`,
        {},
        JSON.stringify({
          content: msg,
          personID:currentUser
          
        })
      )
    }
    setMsg("");
    console.log(msg+" "+currentUser);
  }
    return (
      <>
        <div className="container text-center bottomtext-center ">
          <div className="row myrow">
            <div className="col-10">
              <input
                value={ msg }
                onChange={ (event) => setMsg(event.target.value) }
                onKeyDown={ (event) => {
                  if (event.key == "Enter") {
                    sendBtnHandler();
                  }
                }
                }
                type="text"
                className="form-control"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="visible-addon"
              />
            </div>
            <div className="col iconcol">
              <i className="bi bi-link-45deg myicon"></i>
            </div>
            <div className="col mycol">
              <button type="button" className="btn btn-primary " onClick={sendBtnHandler}>
                Send
              </button>
            </div>
          </div>
        </div>
      </>
    );
}
export default ChatBottom;