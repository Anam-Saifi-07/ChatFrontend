import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Head from "./Head";
import { Link, useNavigate, useSearchParams } from "react-router";
import { isValidElement, useState } from "react";
import { toast } from "react-toastify";
import { createRoomService } from "./Services/RoomService";
import useMyChatContext from "./context/ChatContext";
function App() {
  const {
    roomId,
    currentUser,
    setRoomId,
    setCurrentUser,
    connected,
    setConnected,
    roomOwner,
    setRoomOwner
  } = useMyChatContext();

  const navigate = useNavigate();

  const [detail, setDetail] = useState({
    name: "",
    id:""
  });

  const joinChat = () => {
    if (isformValidate) {
      navigate("/chat");
    }
  }

  const createRoom = async(event) => {
    event.preventDefault();
    if (isformValidate()) {
  
      // call api
      try {
        const response = await createRoomService(detail);
        toast.success("Room created Sucessfully...");
        setCurrentUser(detail.name);
        setRoomId(detail.id);
        setRoomOwner(response.data.name);
        setConnected(true);
        // join the /chat directly after made the room sucessfully
        navigate('/chat');
      } catch (error) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.data);
        if (error.response.status === 400) {
          toast.error(error.response.data);
          return toast.info(detail.id+" ID: already Exist, Enter another");
        }   
      }
    }
  
    setDetail({
      name: "",
      id:""
    });
  }
  const isformValidate = () => {
     if (!detail.name.trim() || !detail.id.trim()) {
       toast.error("Both User Name and id are required!");
       return false;
     }
    return true;
  }
 
  return (
    <>
      <Head></Head>
      <form onSubmit={createRoom}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Type Your Name
          </label>
          <input
            value={detail.name}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, name: event.target.value }))
            }
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Type the id
          </label>
          <input
            value={detail.id}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, id: event.target.value }))
            }
            type="text"
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Room
        </button>
        <Link to="/JoinRoom" className="nav-link">
          Join Room
        </Link>
      </form>
    </>
  );
}
export default App;
