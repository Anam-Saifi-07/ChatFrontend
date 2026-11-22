import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Link, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userLoginService } from "./Services/RoomService";
import { Tokencontext, UserContext, initialUser } from "./context/ChatContext";
import ThemeToggle from "./components/common/ThemeToggle";
import "bootstrap-icons/font/bootstrap-icons.css";

function JoinRoom() {
  const [detail, setDetail] = useState({
    name: "",
    mail: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUserDetails } = useContext(UserContext);
  const { setToken } = useContext(Tokencontext);
  const navigate = useNavigate();

  // Invalidate any active session when reaching the login page (e.g. via browser backward button)
  useEffect(() => {
    if (localStorage.getItem("token") || localStorage.getItem("user")) {
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUserDetails(initialUser);
    }
  }, [setToken, setUserDetails]);

  const isformValidate = () => {
    if (!detail.name.trim()) {
      toast.error("User Name is required!");
      return false;
    }
    if (!detail.mail.trim()) {
      toast.error("Email is required!");
      return false;
    }
    if (!detail.password.trim()) {
      toast.error("Password is required!");
      return false;
    }
    return true;
  };

  const loginUser = async (event) => {
    event.preventDefault();
    if (!isformValidate()) return;

    try {
      setIsSubmitting(true);
      const response = await userLoginService(detail);
      const responseData = response.data;

      setUserDetails({
        name: responseData.name,
        mail: responseData.mail || responseData.gmail || detail.mail,
        gender: responseData.isMale ? "Male" : "Female",
        age: responseData.age,
        phoneNo: responseData.phoneNo,
        id: responseData.id,
      });
      setToken(responseData.token);

      toast.success("Logged in successfully!");
      // Replace history entry so back button doesn't loop back to login form
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400 || error.response?.status === 401) {
        toast.error("Invalid username, email, or password");
      } else {
        toast.error("Login failed. Please check backend connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authContainer">
      {/* Top right theme switcher */}
      <div className="authTopBar">
        <ThemeToggle showLabel={false} />
      </div>

      <div className="authCard">
        <div className="authHeader">
          <div className="authLogo">
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <h1 className="authTitle">Welcome Back</h1>
          <p className="authSubtitle">Sign in to your ChatHub account to continue</p>
        </div>

        <form className="authForm" onSubmit={loginUser}>
          {/* Username */}
          <div className="formGroup">
            <label className="formLabel">
              User Name <span className="requiredStar">*</span>
            </label>
            <input
              value={detail.name}
              onChange={(e) => setDetail((p) => ({ ...p, name: e.target.value }))}
              type="text"
              className="inputControl"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          {/* Email */}
          <div className="formGroup">
            <label className="formLabel">
              Email Address <span className="requiredStar">*</span>
            </label>
            <input
              value={detail.mail}
              onChange={(e) => setDetail((p) => ({ ...p, mail: e.target.value }))}
              type="email"
              className="inputControl"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="formGroup">
            <label className="formLabel">
              Password <span className="requiredStar">*</span>
            </label>
            <input
              value={detail.password}
              onChange={(e) => setDetail((p) => ({ ...p, password: e.target.value }))}
              type="password"
              className="inputControl"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submitBtn" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
            {!isSubmitting && <i className="bi bi-arrow-right"></i>}
          </button>
        </form>

        <div className="authFooter">
          Don't have an account yet?
          <Link to="/" replace className="authFooterLink">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
