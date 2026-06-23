import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Head from "./Head";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import { joinRoomService } from "./Services/RoomService";
import useMyChatContext from "./context/ChatContext";

function JoinRoom() {
  // i am here work htmlFor now join room by id....
  // extract details from form
  // validate the detail and make toast htmlFor  errror
  // call api htm lFor /api/get/{id}
  // navigate to /chat by react router
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

  const [detail, setDetail] = useState({
      name: "",
      id:""
  });

  const isformValidate = () => {
       if (!detail.name.trim() || !detail.id.trim()) {
         toast.error("Both User Name and id are required!");
         return false;
       }
      return true;
  }
  const navigate = useNavigate();
   const joinRoomHandler = async (event) => {
     event.preventDefault();
    //  console.log(detail);
     if (isformValidate()) {
       //  call api
       try {
         const response = await joinRoomService(detail);
          console.log(response);
          setCurrentUser(detail.name);
         setRoomId(detail.id);
         setRoomOwner(response.data.name);
          setConnected(true);
         navigate("/chat");
         return toast.success("Room Joined.");
       } catch (error) {
         console.log(error.response);
         if (error.response.status === 400) {
           return toast.error("Room not Exist...");
         }
       }
     } 
  };
  
  return (
    <>
      <Head></Head>
      <form onSubmit={joinRoomHandler}>
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
            Type the RoomID
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
          Join Room
        </button>
        <Link to="/" className="nav-link">
          Create Room
        </Link>
      </form>
    </>
  );
}
export default JoinRoom;
