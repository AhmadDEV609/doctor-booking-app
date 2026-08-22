import { createContext } from "react";
import { useState, useEffect } from "react";
import { getUser } from "../api/auth.api";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await getUser()

            setUser(res.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}