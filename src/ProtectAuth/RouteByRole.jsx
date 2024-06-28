import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../ProtectAuth/AuthContext';

const RouteBbyRole = ({element, block}) => {
  const { isAuthenticated, role } = useAuth();

  if(role==='FOLLOWER' && (isAuthenticated && block.includes('FOLLOWER'))){
    return <Navigate to="/crypto" />;

  }
  if( role==='ADMIN' && block && (isAuthenticated && block.includes('ADMIN'))){
    return <Navigate to="/admin/*" />;
  }

  if(role==='GUEST' && block && (isAuthenticated && block.includes('GUEST'))){
    return <Navigate to="/login" />;
  }
  if(role==='ADVERTISER' && block && (isAuthenticated && block.includes('ADVERTISER'))){
    return <Navigate to="/adv/*" />;
  }
  return element;
};

export default RouteBbyRole;