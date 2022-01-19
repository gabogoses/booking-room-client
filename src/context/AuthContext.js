import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useNavigate();

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    const [authState, setAuthState] = useState({
        token,
        user: user ? JSON.parse(user) : {},
    });

    console.log(authState);

    const setAuthInfo = ({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setAuthState({
            token,
            user,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({});
        history.push('/login');
    };

    const isAuthenticated = () => {
        if (authState.token && authState.user) {
            return true;
        }
        return true;
    };

    return (
        <Provider
            value={{
                authState,
                setAuthState: (authInfo) => {
                    console.log({authInfo});
                    return setAuthInfo(authInfo);
                },
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };
