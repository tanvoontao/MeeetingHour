import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Navigate } from "react-router-dom";

const PrivateStaffRoute = ({ Component }) => {
    const { staff } = useContext(AuthContext);
    
    return staff.id ? <Component /> : <Navigate to="/staff/login" />
}
 
export default PrivateStaffRoute;