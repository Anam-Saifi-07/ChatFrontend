import "bootstrap/dist/css/bootstrap.min.css";
import ChatHead from "./ChatHead";
import ChatBottom from "./ChatBottom";
import ChatBody from "./ChatBody";

import { useEffect } from "react";
import useMyChatContext from "./context/ChatContext";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import useMySocketContext  from "./context/WebSocketContext";
import { useNavigate } from "react-router";
function Chat() {
  const { stompClient, setStompClient } = useMySocketContext();
  const { roomId, connected } = useMyChatContext();
  const navigate = useNavigate();
  // for handle refresh page then route to "/"
  useEffect(() => {
    if (connected === false) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const handleBack = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  // webSocket connection
  useEffect(() => {
    const sock = new SockJS("http://localhost:8080/chat");
    const client = Stomp.over(sock);
    client.connect({}, () => {
      setStompClient(client);
    });

    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, []);

  return (
    <>
        <ChatHead></ChatHead>
        <ChatBody></ChatBody>
        <ChatBottom ></ChatBottom>
    </>
  );
}
export default Chat;