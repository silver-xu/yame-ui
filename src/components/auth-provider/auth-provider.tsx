import React, { ReactNode, useState } from 'react';
import uuidv4 from 'uuid';
import { useFacebookLogin } from '../../hooks/react-use-fb-login';
import { IUser, UserType } from '../../types';

const AUTH_TOKEN_KEY = 'anonymousAuthToken';
const APP_ID = '330164834292470';

export interface IAuthProviderProps {
    children?: ReactNode;
    onLoginSuccess?: () => {};
    onLogoutSuccess?: () => {};
}

export interface IAuthContextValue {
    currentUser: IUser;
    login: () => void;
    logout: () => void;
}

export const AuthContext = React.createContext<IAuthContextValue>({
    login: () => {},
    logout: () => {},
    currentUser: {
        authToken: 'foobar',
        id: 'foobar',
        isValid: true,
        userName: 'foobar',
        userType: UserType.Anonymous
    }
});

export const AuthProvider = (props: IAuthProviderProps) => {
    const { children, onLoginSuccess, onLogoutSuccess } = props;
    const [currentUser, setCurrentUser] = useState<IUser>(getAnonymousUser());

    const [_, login, logout] = useFacebookLogin({
        appId: APP_ID,
        language: 'EN',
        version: '3.1',
        fields: ['id', 'name', 'email'],
        onLoginSuccess: response => {
            setCurrentUser({
                authToken: response.id,
                id: response.id,
                isValid: true,
                userName: response.name,
                userType: UserType.Facebook
            });

            handleLoginSuccess(response, onLoginSuccess);
        },
        onLogoutSuccess: () => {
            setCurrentUser(getAnonymousUser());
            handleLogoutSuccess(onLogoutSuccess);
        }
    });

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const getAnonymousUser = () => {
    const anonymousAuthToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const anonymousOrNewAuthToken = anonymousAuthToken
        ? anonymousAuthToken
        : uuidv4();

    if (anonymousAuthToken !== anonymousOrNewAuthToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, anonymousOrNewAuthToken);
    }

    return {
        authToken: anonymousOrNewAuthToken,
        id: anonymousOrNewAuthToken,
        isValid: true,
        userName: 'Anonymous',
        userType: UserType.Anonymous
    };
};

const handleLoginSuccess = (
    response: any,
    onLoginSuccess?: (response: any) => {}
) => {
    console.log(response);
    if (onLoginSuccess) {
        onLoginSuccess(response);
    }
};
const handleLogoutSuccess = (onLogoutSuccess?: () => {}) => {
    console.log('logged out');

    if (onLogoutSuccess) {
        onLogoutSuccess();
    }
};
