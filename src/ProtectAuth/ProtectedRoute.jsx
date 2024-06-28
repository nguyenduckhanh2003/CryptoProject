import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../ProtectAuth/AuthContext';

const ProtectedRoute = ({ element, allowedRoles}) => {
  const { isAuthenticated, role } = useAuth();
  console.log(role);

  if (!role && !isAuthenticated) {
    return <Navigate to="/login" />;
  }


  if ( role !='ADMIN' && allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/crypto" />;
  }
  if ( role ==='FOLLOWER' && allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/portfolio" />;
  }

  if ( role ==='ADVERTISER' && allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/adv/*" />;
  }

  return element;
};

export default ProtectedRoute;
