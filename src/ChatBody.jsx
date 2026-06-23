import { useEffect, useRef, useState } from "react";
import "./ChatBody.css";
import MsgBox from "./MsgBox";
import { baseURL } from "./config/AxiosHelper";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import useMySocketContext from "./context/WebSocketContext";
import useMyChatContext from "./context/ChatContext";
import { getALLMsg } from "./Services/RoomService";
function ChatBody() {
  
  const [upcomingMsg, setUpcomingMsg] = useState([
    
  ]);

  const inputref = useRef(null);
  const chatBoxRef = useRef();
  // const [currentUser] = useState("Anam Saifi");

  const { stompClient, setStompClient } = useMySocketContext();
  const { connected, setConnected, roomId, setRoomId, currentUser,setCurrentUser } =
    useMyChatContext();

 useEffect(() => {
   const loadMessages = async () => {
     if (!connected) return;

     try {
       const response = await getALLMsg(roomId);
       setUpcomingMsg(response.data);
       console.log(response.data);
     } catch (error) {
       console.log(error.response);
     }
   };

   loadMessages();
 }, [connected, roomId]);
  
  useEffect(() => {
    if (!connected || !stompClient) return;
 
     const subscription= stompClient.subscribe(`/topic/msg/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        setUpcomingMsg((prev) => [...prev, data]);
      });
    
     return () => {
       subscription.unsubscribe();
     };
  }, [roomId, connected, stompClient]);

    return (
      <>
        <div className={`maindiv overflow-auto `}>
          {upcomingMsg.map((msg) => (
            <MsgBox
              msg={msg}
              key={msg.id}
              currentUser={currentUser}
            ></MsgBox>
          ))}
          {/* <MsgBox></MsgBox> */}
        </div>
      </>
    );
}
export default ChatBody;