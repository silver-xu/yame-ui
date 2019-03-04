import React, { ReactNode, useState } from 'react';
import { useFacebookLogin } from '../../hooks/react-use-fb-login';

export interface IAuthProviderProps {
    children?: ReactNode;
    updateAuthToken: (authToken: string) => void;
}

export interface IAuthProviderState {
    authToken?: string;
}

export interface IAuthContextValue {
    authToken?: string;
    updateAuthToken: (authToken: string) => void;
}

export const AuthContext = React.createContext<IAuthContextValue>({
    authToken: 'foobar',
    updateAuthToken: (_: string) => {}
});

export const AuthProvider = (props: IAuthProviderProps) => {
    const { children, updateAuthToken } = props;

    const [{ currentUser, isLoggedIn }, login, logout] = useFacebookLogin({
        appId: '330164834292470',
        language: 'EN',
        version: '3.1',
        fields: ['id', 'name', 'email']
    });

    const authToken =
        currentUser && currentUser.id ? currentUser.id : undefined;

    return (
        <AuthContext.Provider value={{ authToken, updateAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};
