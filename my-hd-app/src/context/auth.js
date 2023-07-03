import React, { createContext, useEffect, useState } from "react";
import Loading from "../component/Loading";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [staff, setStaff] = useState(null)
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser({
            token: localStorage.getItem("token"),
            email: localStorage.getItem("email"),
            id: localStorage.getItem("id")
        })

        setStaff({
            token: localStorage.getItem("staff_token"),
            email: localStorage.getItem("staff_email"),
            id: localStorage.getItem("staff_id")
        })

        setAdmin({
            token: localStorage.getItem("admin_token"),
            email: localStorage.getItem("admin_email"),
            id: localStorage.getItem("admin_id")
        })

        setLoading(false);
    }, []);
    if (loading) {
        return <Loading />;
    }

    return <AuthContext.Provider value={{ user, staff, admin }}>{children}</AuthContext.Provider>
}

export default AuthProvider;