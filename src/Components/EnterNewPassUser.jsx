import React, { useState, useEffect } from 'react';
import '../css/EnterNewPassUser.css';
import { useLocation } from 'react-router-dom';

function EnterNewPassUser() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState('');
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const otp = searchParams.get('otp');
        const getEmail = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/auth/email-by-otp/${otp}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to get email');
                }

                setEmail(data.value.email);
                console.log(data.value.email);
            } catch (error) {
                console.error('Error fetching email:', error);
                setNotification(error.message || 'Failed to get email');
            }
        };


        getEmail();
    },);
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setNotification('Please enter new password and confirm password');
        }else{
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                setNotification('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
            }else{
                if (newPassword !== confirmPassword) {
                    setNotification('Passwords do not match');
                } else {
                    try {
                        const requestBody = {
                            email: email,
                            password: newPassword,
                        };
            
                    console.log("Request body:", requestBody); 
                        setNotification('');
                        const response = await fetch('http://localhost:8000/api/v1/auth/forget-password', {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                email: email,
                                newPassword: newPassword,
                                confirmNewPassword: confirmPassword,
                            }),
                            
                        });
                        console.log("API response status:", response.status);
                        if (!response.ok) {
                            throw new Error('Failed to reset password');
                        } else {
                            setTimeout(() => {
                                setNotification('Password reset successfully');
                                window.location.href = "/login";
                            }, 1000);
        
                        }
        
                    } catch (error) {
                        setNotification(error.message || 'Failed to reset password');
                    }
                }
            }
        }
       
    };

    return (
        <div className='change_password_container'>
            <div className='change_password'>
                <form onSubmit={handleChangePassword}>
                    <h2>Change Password</h2>
                    <div className='form_group'>
                    <label htmlFor='email'>Email:</label>
                        <input
                            id='email'
                            type='text'
                            value={email}
                            disabled
                        />
                        <label htmlFor='newPassword'>New Password:</label>
                        <input
                            id='newPassword'
                            type='password'
                            placeholder='Enter new password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className='form_group'>
                        <label htmlFor='confirmPassword'>Confirm New Password:</label>
                        <input
                            id='confirmPassword'
                            type='password'
                            placeholder='Confirm new password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {notification && <div className='notification_message)'>{notification}</div>}
                    <button type='submit' className='change_button'>Change Password</button>
                </form>
            </div>
        </div>

    );
}

export default EnterNewPassUser;
