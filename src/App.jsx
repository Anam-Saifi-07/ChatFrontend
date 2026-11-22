import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Link, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userRegister } from "./Services/RoomService";
import { Tokencontext, UserContext, initialUser } from "./context/ChatContext";
import ThemeToggle from "./components/common/ThemeToggle";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const { setUserDetails } = useContext(UserContext);
  const { setToken } = useContext(Tokencontext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    password: "",
    gender: "",
    age: "",
    phoneNo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invalidate any active session when reaching the registration page (e.g. via browser backward button)
  useEffect(() => {
    if (localStorage.getItem("token") || localStorage.getItem("user")) {
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUserDetails(initialUser);
    }
  }, [setToken, setUserDetails]);

  const registeringNewUser = async (event) => {
    event.preventDefault();
    if (!isformValidate()) return;

    try {
      setIsSubmitting(true);
      const { gender, ...otherFields } = formData;
      const payload = {
        ...otherFields,
        age: parseInt(formData.age, 10),
        isMale: gender.toLowerCase() === "male",
      };

      const response = await userRegister(payload);
      const responseData = response.data;

      setUserDetails({
        name: responseData.name,
        mail: responseData.mail || responseData.gmail || formData.mail,
        gender: responseData.isMale ? "Male" : "Female",
        age: responseData.age,
        phoneNo: responseData.phoneNo,
        id: responseData.id,
      });
      setToken(responseData.token);

      toast.success("Account created successfully!");
      // Replace history entry so back button doesn't loop back to register form
      navigate("/home", { replace: true });
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isformValidate = () => {
    if (!formData.name.trim()) {
      toast.error("User Name is required!");
      return false;
    }
    if (!formData.gender.trim()) {
      toast.error("Gender is required!");
      return false;
    }
    if (!formData.age || parseInt(formData.age, 10) <= 0) {
      toast.error("Valid age is required!");
      return false;
    }
    if (!formData.phoneNo.trim()) {
      toast.error("Phone number is required!");
      return false;
    }
    if (!formData.mail.trim()) {
      toast.error("Email is required!");
      return false;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }
    return true;
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
          <h1 className="authTitle">Create Account</h1>
          <p className="authSubtitle">Join ChatHub to connect with friends and communities</p>
        </div>

        <form className="authForm" onSubmit={registeringNewUser}>
          {/* Full Name */}
          <div className="formGroup">
            <label className="formLabel">
              Full Name <span className="requiredStar">*</span>
            </label>
            <input
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              type="text"
              className="inputControl"
              placeholder="e.g. John Doe"
              required
            />
          </div>

          {/* Gender & Age Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="formGroup">
              <label className="formLabel">
                Gender <span className="requiredStar">*</span>
              </label>
              <select
                value={formData.gender}
                className="inputControl"
                onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}
                required
              >
                <option value="" disabled hidden>
                  Select
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="formGroup">
              <label className="formLabel">
                Age <span className="requiredStar">*</span>
              </label>
              <input
                value={formData.age}
                onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
                type="number"
                min="10"
                max="120"
                className="inputControl"
                placeholder="21"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="formGroup">
            <label className="formLabel">
              Phone Number <span className="requiredStar">*</span>
            </label>
            <input
              value={formData.phoneNo}
              onChange={(e) => setFormData((p) => ({ ...p, phoneNo: e.target.value }))}
              type="tel"
              className="inputControl"
              placeholder="e.g. +91 9876543210"
              required
            />
          </div>

          {/* Email */}
          <div className="formGroup">
            <label className="formLabel">
              Email Address <span className="requiredStar">*</span>
            </label>
            <input
              value={formData.mail}
              onChange={(e) => setFormData((p) => ({ ...p, mail: e.target.value }))}
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
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              type="password"
              className="inputControl"
              placeholder="At least 6 characters"
              required
            />
          </div>

          <button type="submit" className="submitBtn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Register Now"}
            {!isSubmitting && <i className="bi bi-arrow-right"></i>}
          </button>
        </form>

        <div className="authFooter">
          Already have an account?
          <Link to="/joinRoom" replace className="authFooterLink">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
