import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Head from "./Head";
import { Link, useNavigate } from "react-router";
import { use, useContext, useState } from "react";
import { toast } from "react-toastify";
import { userLoginService } from "./Services/RoomService";
import useMyChatContext, { Tokencontext, UserContext } from "./context/ChatContext";

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
    mail:"",
    password:""
  });

   const { userDetails, setUserDetails } = useContext(UserContext);
   const { token, setToken } = useContext(Tokencontext);
  
  const isformValidate = () => {
       if (!detail.name.trim() || !detail.password.trim()) {
         toast.error("Both User Name and id are required!");
         return false;
       }
    if (!detail.mail.trim()) {
      toast.error("Email is Required");
      return false;
    }
      return true;
  }
  const navigate = useNavigate();
   const loginUser = async (event) => {
     event.preventDefault();
     console.log(detail);
     if (isformValidate()) {
       //  call api
       try {
         const response = await userLoginService(detail);
         const responseData = response.data;
         console.log(response);
         setUserDetails({
           name: responseData.name,
           mail: responseData.mail,
           gender: responseData.gender ? "Male" : "Female",
           age: responseData.age,
           phoneNo: responseData.phoneNo,
           id: responseData.id,
         });
         setToken(responseData.token);
         // console.log(response.headers);
         // console.log(response.data);
         //   setCurrentUser(detail.name);
         //  setRoomId(detail.id);
         //  setRoomOwner(response.data.name);
         //   setConnected(true);

         setDetail({
           name: "",
           mail: "",
           password: "",
         });
          navigate("/home");
         toast.success("Login Sucessfully.");
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
      <form onSubmit={loginUser}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Type Your MailID <i>(ex: user@gmail.com)</i>
          </label>
          <input
            value={detail.mail}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, mail: event.target.value }))
            }
            type="mail"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Type Your Username <i>(ex: @username_001)</i>
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

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Type the Password
          </label>
          <input
            value={detail.password}
            onChange={(event) =>
              setDetail((prev) => ({ ...prev, password: event.target.value }))
            }
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <Link to="/" className="nav-link">
          Register
        </Link>
      </form>
    </>
  );
}
export default JoinRoom;
