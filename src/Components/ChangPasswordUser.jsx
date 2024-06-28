import React, { useState, useEffect } from 'react';
import '../css/ChangPasswordUser.css';

function ChangPasswordUser() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // useEffect(() => {
  //   if (notification) {
  //     setTimeout(() => {
  //       setNotification('');
  //     }, 5000); // Clear notification after 5 seconds
  //   }
  // }, [notification]);

  // Function to get OTP
  const getOtp = async () => {
    try {
      if (!email) {
        throw new Error('Please enter an email');
      }
      setLoading(true);
      setNotification('');
      const response = await fetch('http://localhost:8000/api/v1/auth/code-for-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }
      setNotification('OTP sent to your email');
      // setOtp(''); // Clear previous OTP
    } catch (error) {
      setNotification(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Function to reset password
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      if (!email || !otp) {
        throw new Error('Please enter email and OTP');
      }
      setLoading(true);
      setNotification('');
      const response = await fetch('http://localhost:8000/api/v1/auth/check-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }else{
        window.location.href = '/enterNewPass?otp='+otp;
        console.log('Request sent successfully');
      }
    } catch (error) {
      setNotification(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='reset_Password'>
      <form onSubmit={resetPassword}>
        <h2>Reset Password</h2>
        <div className='form_group'>
          <div className='enter_email'>
            <label htmlFor='email'>Email:</label>
            <input
              id='email'
              type='text'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className='otp_button'
              type='button'
              onClick={getOtp}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Get OTP'}
            </button>
          </div>
          <div className='enter_otp'>
            <label htmlFor='otp'>Enter OTP:</label>
            <input
              id='otp'
              type='text'
              placeholder='Enter OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className='reset_password'>
            {notification && <div className={`notification_message ${notification.includes('Failed') ? 'error' : 'success'}`}>{notification}</div>}
            <button className='reset_button' type='submit' disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChangPasswordUser;
