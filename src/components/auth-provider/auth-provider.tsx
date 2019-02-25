import React, { Component, ReactNode } from 'react';

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

export class AuthProvider extends Component<
    IAuthProviderProps,
    IAuthProviderState
> {
    constructor(props: IAuthProviderProps) {
        super(props);

        this.state = {};
    }

    public render() {
        const { authToken } = this.state;
        const { children, updateAuthToken } = this.props;

        return (
            <AuthContext.Provider value={{ authToken, updateAuthToken }}>
                {children}
            </AuthContext.Provider>
        );
    }
}
