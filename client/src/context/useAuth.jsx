import {useContext} from 'react';
import {useState} from 'react';
import {createContext} from 'react';
import {useEffect} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchUser() {
        try {
            const res = await fetch('/api/auth/me', {
                credentials: 'include',
            });
            if (res.ok) {
                setUser(await res.json());
            }
        } catch (err) {
            console.log("Network error");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {fetchUser()}, []);

    return <AuthContext.Provider value={{user, loading, setUser}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}