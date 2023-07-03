import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ Component }) => {
    const { user } = useContext(AuthContext); // get the user
    
    return user.id ? <Component /> : <Navigate to="/login" />
}
 
export default PrivateRoute;