import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Head from "./Head";
import { data, Link, useNavigate, useSearchParams } from "react-router";
import { isValidElement, useContext, useState } from "react";
import { toast } from "react-toastify";
import { createRoomService, userRegister } from "./Services/RoomService";
import useMyChatContext, { Tokencontext, UserContext } from "./context/ChatContext";
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

  const { setUserDetails } =useContext(UserContext);
  const { setToken } = useContext(Tokencontext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    password: "",
    gender: "",
    age: "",
    phoneNo:""
  });

  // const joinChat = () => {
  //   if (isformValidate) {
  //     navigate("/chat");
  //   }
  // }

  const registeringNewUser = async (event) => { 
    event.preventDefault();
    if (isformValidate()) {
      // call api
      try {
        //map the gender to boolean isMale for backend
        // 1. Extract gender and gather all other fields
        const { gender, ...otherFields } = formData;

        // 2. Build backend payload with mapped boolean
        const payload = {
          ...otherFields,
          isMale: gender.toLowerCase() == "male",
        };

        const response = await userRegister(payload);
        
        // console.log(formData);
        console.log(response);
        const responseData = response.data;
        setUserDetails({
          name: responseData.name,
          mail: responseData.mail,
          gender: responseData.gender?true:false,
          age: responseData.age,
          phoneNo: responseData.phoneNo,
          id:responseData.id
        });
        setToken(responseData.token);
        console.log("token:" + responseData.token);
        // console.log("userDetails:" + userDetails);
        toast.success("Registered created Sucessfully...");
        // setCurrentUser(formData.name);
        // setRoomId(formData.id);
        // setRoomOwner(response.data.name);
        // setConnected(true);
        // join the /chat directly after made the room sucessfully
        navigate('/home');

        //when got register sucessfully
        setFormData({
          name: "",
          mail: "",
          password: "",
          gender: "",
          age: "",
          phoneNo: ""
        });
      } catch (error) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.data);
        if (error.response.status === 400) {
          toast.error(error.response.data);
          return toast.info(formData.id+" ID: already Exist, Enter another");
        }   
      }
    }
  
   
  }
  const isformValidate = () => {
     if (!formData.name.trim()) {
       toast.error("User Name is required!");
       return false;
     }
    if (
      !formData.age.trim()
    ) {
      toast.error("User age required!");
      return false;
    }
    if (!formData.gender.trim() 
    ) {
      console.log(formData.gender);
      toast.error("User Gender required!");
      return false;
    }
    if (
      !formData.password.trim()
    ) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  }
 
  return (
    <>
      <Head></Head>
      <form onSubmit={registeringNewUser}>
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Type Your Name <i>(ex: fullName)</i>
            <i style={{ color: "red" }}>*</i>
          </label>
          <input
            value={formData.name}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, name: event.target.value }))
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
          <label htmlFor="exampleInputEmail1" className="form-label">
            Select Your Gender <i style={{ color: "red" }}>*</i>
          </label>
          <select
            value={formData.gender}
            className="form-select"
            aria-label="Default select example"
            onChange={(e) =>
              setFormData((p) => ({ ...p, gender: e.target.value }))
            }
            required
          >
            <option value="" disabled hidden></option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Age */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Enter Your Age <i>(ex: 21)</i> <i style={{ color: "red" }}>*</i>
          </label>
          <input
            value={formData.age}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, age: event.target.value }))
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
            <i style={{ color: "red" }}>*</i>
          </label>
          <input
            value={formData.phoneNo}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, phoneNo: event.target.value }))
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
            value={formData.mail}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, mail: event.target.value }))
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
            <i style={{ color: "red" }}>*</i>
          </label>
          <input
            value={formData.password}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, password: event.target.value }))
            }
            type="password"
            className="form-control"
            id="InputPassword"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
        <Link to="/JoinRoom" className="nav-link">
          Login
        </Link>
      </form>
    </>
  );
}
export default App;
