import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "../styles/Register.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    profileImage: null,
  });
  console.log(formData);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  },[formData.password, formData.confirmPassword]);

  useEffect(() => {
    setPhoneNumberValid(formData.phoneNumber.length === 10 || formData.phoneNumber === "");
  }, [formData.phoneNumber]);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!phoneNumberValid) {
      return;
    }

    try {
      const register_form = new FormData()

      for (var key in formData) {
        register_form.append(key, formData[key])
      }

      const response = await fetch("https://rentify-backend-bi7v.onrender.com/auth/register", {
        method: "POST",
        body: register_form
      })

      if (response.ok) {
        navigate("/login")
      }
    } catch (err) {
      console.log("Registration failed", err.message)
    }
  }

  return (
    <div className="register">
      <div className="register_content">
      <h1 className="reg_title">Rentify</h1>
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Phone Number"  
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          {!phoneNumberValid && (
            <p style={{ color: "red" }}>Phone number must be exactly 10 digits!</p>
          )}
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="" />
            <p>Upload Your Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt=""
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>REGISTER</button>
        </form>
        <a href="https://frontend-rentify.vercel.app/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;