
import {
    createContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import { getUser } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);

        try {
            const res = await getUser();
            setUser(res.user ?? null);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;

        const checkUser = async () => {
            try {
                const res = await getUser();

                if (active) {
                    setUser(res.user ?? null);
                }
            } catch (error) {
                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        const handleSessionExpired = () => {
            setUser(null);
            setLoading(false);
        };

        window.addEventListener(
            "auth:session-expired",
            handleSessionExpired
        );

        checkUser();

        return () => {
            active = false;

            window.removeEventListener(
                "auth:session-expired",
                handleSessionExpired
            );
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
