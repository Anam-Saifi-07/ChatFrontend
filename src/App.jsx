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
    // id:""
    gender: "",
    age: "",
    phone: "",
    email: "",
    password:""
  });

  const joinChat = () => {
    if (isformValidate) {
      navigate("/chat");
    }
  }

  const createRoom = async (event) => {
    // console.log(detail);
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
      // id:""
      gender: "",
      age: "",
      phone: "",
      email: "",
      password: "",
    });
  }
  const isformValidate = () => {
     if (!detail.name.trim()) {
       toast.error("User Name is required!");
       return false;
     }
    if (
      !detail.age.trim()
    ) {
      toast.error("User age required!");
      return false;
    }
    if (!detail.gender.trim() 
    ) {
      toast.error("User Gender required!");
      return false;
    }
    if (
      !detail.password.trim()
    ) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  }
 
  return (
    <>
      <Head></Head>
      <form onSubmit={createRoom}>
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Type Your Name <i>(ex: fullName)</i>
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
            required
          />
        </div>
        {/* Gender */}
        <div className="mb-3">
          <select
            className="form-select"
            aria-label="Default select example"
            required
          >
            <option selected>Select Your Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Age */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Enter Your Age <i>(ex: 21)</i>
          </label>
          <input
            value={detail.age}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, age: event.target.value }))
            }
            type="number"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            required
          />
        </div>
        {/* Pnone Number */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Type Your Phone No <i>(ex: 967800xxxx)</i>
          </label>
          <input
            value={detail.phone}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, phone: event.target.value }))
            }
            type="tel"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Type Your Email <i>(ex: username001@gmail.com)</i>
          </label>
          <input
            value={detail.email}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, email: event.target.value }))
            }
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Type Your Password <i>(ex: suggests strong one)</i>
          </label>
          <input
            value={detail.password}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, password: event.target.value }))
            }
            type="password"
            className="form-control"
            id="InputPassword"
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
