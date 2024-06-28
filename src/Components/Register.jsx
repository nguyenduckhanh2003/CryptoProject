import React, { useState } from 'react'
import '../css/Register.css';
import registerBg from '../Img/back_form.jpg';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const validateEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };

  const validatePassword = (password) => {
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,23}$/;
    return regexPassword.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim() || !firstName.trim() || !lastName.trim() || !gender) {
      setErrorMessage('Please enter value.');
    } else if (!validateEmail(email)) {
      setErrorMessage('Invalid email format.');
    } else if (!validatePassword(password)) {
      setErrorMessage('Password must be 8-23 characters long, contain at least one number, one lowercase letter, one uppercase letter, and one special character.');
    } else if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
    } else {
      setErrorMessage('');
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            gender,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Register successful!', data);
          window.location.href = '/login';
        } else {
          setErrorMessage(data.message || 'Registration failed.');
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again later.');
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="register">
      <img
        src={registerBg}
        alt="image"
        className="register__bg"
      />

      <form action="" className="register__form" onSubmit={handleSubmit}>
      <a href="/crypto">
          <i className="bi bi-arrow-left"></i>
        </a>
        <h1 className="register__title">Register</h1>
        <div className="register__inputs">
          <div className="register__box name">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="register__input"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </div>
          <div className="register__box name">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="register__input"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </div>
          <div className="register__box">
            <select
              name="gender"
              className="register__input"
              value={gender}
              onChange={handleGenderChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="UNDEFINED_YET">Other</option>
            </select>
          </div>
          <div className="register__box">
            <input
              type="text"
              name="email"
              placeholder="Email ID"
              className="register__input"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="register__box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="register__input"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="register__box">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="register__input"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
        </div>
        {errorMessage && <p className="register__error">{errorMessage}</p>}

        <button type="submit" className="register__button">
          Register
        </button>

        <div className="login__account">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  )
}

export default Register;
