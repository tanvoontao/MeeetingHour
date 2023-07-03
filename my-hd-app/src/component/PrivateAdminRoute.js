import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ Component }) => {
    const { admin } = useContext(AuthContext); 
    
    return admin.id ? <Component /> : <Navigate to="/admin/login" />
}
 
export default PrivateAdminRoute;