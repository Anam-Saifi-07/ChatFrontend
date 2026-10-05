import { Children, createContext, use, useContext, useState } from "react";

const myChatContext = createContext();

export const MyChatProvider = ({children}) => {
    const [roomId, setRoomId] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [roomOwner, setRoomOwner] = useState("");
  const [connected, setConnected] = useState(false);

    return (
      <myChatContext.Provider
        value={{
          roomId,
          currentUser,
          setRoomId,
          setCurrentUser,
          connected,
          setConnected,
          roomOwner,
          setRoomOwner,
        }}
      >
        {children}
      </myChatContext.Provider>
    );
}
const useMyChatContext = ()=> useContext(myChatContext);
export default useMyChatContext;