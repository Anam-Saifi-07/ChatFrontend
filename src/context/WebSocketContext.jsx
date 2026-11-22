
import { Children, createContext, use, useContext, useState } from "react";

const myWebSocketContext = createContext();

export const MySocketProvider = ({children}) => {
  const [stompClient, setStompClient] = useState(null);
  
 
    return (
      <myWebSocketContext.Provider
        value={{
         stompClient,
         setStompClient
        }}
      >
        {children}
      </myWebSocketContext.Provider>
    );
}

const useMySocketContext = ()=> useContext(myWebSocketContext);
export default useMySocketContext;
