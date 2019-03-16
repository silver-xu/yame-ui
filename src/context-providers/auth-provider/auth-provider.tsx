import React, { ReactNode, useState } from 'react';
import uuidv4 from 'uuid';
import { useFacebookLogin } from '../../hooks/react-use-fb-login';
import { IUser, UserType } from '../../types';

const AUTH_TOKEN_KEY = 'anonymousAuthToken';
const APP_ID = process.env.REACT_APP_FB_APP_ID || '';

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

export interface IAuthProviderProps {
    children?: ReactNode;
    onLoginSuccess?: (loggedInUser: IUser) => {};
    onLogoutSuccess?: () => {};
}

export interface IAuthContextValue {
    currentUser?: IUser;
    login: () => void;
    logout: () => void;
}

export const AuthContext = React.createContext<IAuthContextValue>({
    login: () => {},
    logout: () => {}
});

export const AuthProvider = React.memo((props: IAuthProviderProps) => {
    const { children, onLoginSuccess, onLogoutSuccess } = props;

    const [currentUser, setCurrentUser] = useState<IUser | undefined>(
        undefined
    );

    const [_, login, logout] = useFacebookLogin({
        appId: APP_ID,
        language: 'EN',
        version: '3.1',
        fields: ['id', 'name', 'email'],
        onLoginSuccess: loggedInFBUser => {
            const user = {
                authToken: `fb-${loggedInFBUser.accessToken}`,
                id: loggedInFBUser.id,
                isValid: true,
                userName: loggedInFBUser.name,
                userType: UserType.Facebook
            };
            setCurrentUser(user);
            handleLoginSuccess(user, onLoginSuccess);
        },
        onLogoutSuccess: () => {
            setCurrentUser(getAnonymousUser());
            handleLogoutSuccess(onLogoutSuccess);
        },
        onFailure: () => {
            setCurrentUser(getAnonymousUser());
        }
    });

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
});

const handleLoginSuccess = (
    loggedInFBUser: IUser,
    onLoginSuccess?: (response: any) => {}
) => {
    if (onLoginSuccess) {
        onLoginSuccess(loggedInFBUser);
    }
};
const handleLogoutSuccess = (onLogoutSuccess?: () => {}) => {
    console.log('logged out');

    if (onLogoutSuccess) {
        onLogoutSuccess();
    }
};
