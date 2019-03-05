import React, { ReactNode, useState } from 'react';
import uuidv4 from 'uuid';
import { useFacebookLogin } from '../../hooks/react-use-fb-login';
import { IUser, UserType } from '../../types';

const AUTH_TOKEN_KEY = 'anonymousAuthToken';
const APP_ID = '330164834292470';

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
    onLoginSuccess?: () => {};
    onLogoutSuccess?: () => {};
}

export interface IAuthContextValue {
    currentUser?: IUser;
    login: () => void;
    logout: () => void;
    signInToken?: string;
}

export const AuthContext = React.createContext<IAuthContextValue>({
    login: () => {},
    logout: () => {}
});

export const AuthProvider = (props: IAuthProviderProps) => {
    const { children, onLoginSuccess, onLogoutSuccess } = props;

    const [currentUser, setCurrentUser] = useState<IUser | undefined>(
        undefined
    );
    const [signInToken, setSignInToken] = useState<string>(uuidv4());

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

            setSignInToken(uuidv4());
        },
        onLogoutSuccess: () => {
            setCurrentUser(getAnonymousUser());
            handleLogoutSuccess(onLogoutSuccess);

            setSignInToken(uuidv4());
        },
        onFailure: () => {
            setCurrentUser(getAnonymousUser());
            setSignInToken(uuidv4());
        }
    });

    return (
        <AuthContext.Provider
            value={{ currentUser, login, logout, signInToken }}
        >
            {children}
        </AuthContext.Provider>
    );
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
