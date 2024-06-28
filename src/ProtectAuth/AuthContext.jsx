import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookies, getCookies } from '../Helps/Cookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('ADMIN');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const generateRandomString = (length)=> {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
  useEffect(() => {
    const storedRole = getCookies('role');
    if(storedRole){
      setIsAuthenticated(true);
      setRole(storedRole);
      console.log(storedRole);
    }  
    else {
      setIsAuthenticated(false);
      setRole('GUEST');
      setCookies('GUEST', generateRandomString(30),  { expires: 1 }) ;
    }  
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, role}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
    const authContext = useContext(AuthContext);
    console.log("Role in useAuth:", authContext.role);
    console.log("isAuthenticated in useAuth:", authContext.isAuthenticated);
    return authContext;
  };