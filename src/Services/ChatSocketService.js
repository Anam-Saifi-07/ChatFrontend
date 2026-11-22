import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { baseURL, httpclient } from "../config/AxiosHelper";

export const ROOM_TOPIC = (roomId) => `/topic/room.${roomId}/messages`;
export const SEND_DESTINATION = "/app/chat.sendMessage";

export const fetchRoomMessages = async (roomId) => {
  const response = await httpclient.get(`/api/v2/rooms/${roomId}/messages`);
  return response.data;
};

export const connectChatSocket = (onConnect, onError) => {
  const sock = new SockJS(`${baseURL}/ws-chat`);
  const client = Stomp.over(sock);
  client.debug = () => {};

  const token = localStorage.getItem("token");
  client.connect(
    token ? { Authorization: `Bearer ${token}` } : {},
    () => onConnect(client),
    (err) => {
      if (onError) onError(err);
    },
  );

  return client;
};

export const subscribeToRoom = (client, roomId, onMessage) => {
  return client.subscribe(ROOM_TOPIC(roomId), (message) => {
    onMessage(JSON.parse(message.body));
  });
};

export const sendRoomMessage = (client, roomId, content) => {
  if (!client || !client.connected) return false;
  client.send(
    SEND_DESTINATION,
    {},
    JSON.stringify({ roomId, content }),
  );
  return true;
};

export const disconnectChatSocket = (client) => {
  if (client && client.connected) client.disconnect();
};
export const fetchAllMessage=async () => {
  httpclient.get("/api/v2/rooms/{roomId}/messages");
}
