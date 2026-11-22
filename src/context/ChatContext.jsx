import { createContext, useContext, useState, useEffect } from "react";

const myChatContext = createContext();

export const MyChatProvider = ({ children }) => {
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
};

const useMyChatContext = () => useContext(myChatContext);
export default useMyChatContext;

export const initialUser = {
  name: "",
  mail: "",
  gender: "",
  age: "",
  phoneNo: "",
  id: "",
};

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userDetails, setUserDetails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || initialUser;
    } catch {
      return initialUser;
    }
  });

  useEffect(() => {
    if (userDetails && userDetails.id) {
      localStorage.setItem("user", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("user");
    }
  }, [userDetails]);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
}

export const Tokencontext = createContext();

export function TokenProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <Tokencontext.Provider value={{ token, setToken }}>
      {children}
    </Tokencontext.Provider>
  );
}
