import { BrowserRouter,Routes,Route } from "react-router";
import JoinRoom from "./JoinRoom";
import App from "./App";
import Chat from "./Chat";
import HomeView from "./components/views/HomeView";
function MainRoutes() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App></App>}></Route> 
            <Route path="/home" element={<HomeView></HomeView>}></Route> 
            <Route path="/joinRoom" element={<JoinRoom></JoinRoom>}></Route> 
            <Route path="/chat" element={<Chat></Chat>}></Route> 
          </Routes>
        </BrowserRouter>
      </>
    );
}
export default MainRoutes;