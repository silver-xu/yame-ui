import { useEffect, useState } from 'react';

export interface IAvatar {
    url: string;
    width: number;
    height: number;
}

export interface IFacebookUser {
    id?: string;
    name?: string;
    email?: string;
    accessToken: string;
    avatar?: IAvatar;
}

export interface IFaceBookLoginState {
    isLoggedIn: boolean;
    facebookUser?: IFacebookUser;
    loaded: boolean;
}

type FacebookFields = 'name' | 'email' | 'gender' | 'id';

export interface IFaceBookLoginProps {
    appId: string;
    language: string;
    version: string;
    fields: FacebookFields[];
    onFailure?: (response: any) => void;
    onLoginSuccess?: (user: IFacebookUser) => void;
    onLogoutSuccess?: () => void;
}

const getWindow = (): any => {
    return window as any;
};

const getUserInfo = (
    props: IFaceBookLoginProps,
    state: IFaceBookLoginState,
    setState: (state: IFaceBookLoginState) => void,
    accessToken: string
): void => {
    getWindow().FB.api(
        '/me',
        { locale: props.language, fields: props.fields.join(',') },
        (response: any) => {
            getWindow().FB.api(
                `/${response.id}/picture?redirect=false`,
                {},
                (pictureResponse: any) => {
                    const currentUser: IFacebookUser = {
                        ...response,
                        accessToken,
                        avatar: pictureResponse.data
                    };

                    setState({
                        ...state,
                        isLoggedIn: true,
                        facebookUser: currentUser,
                        loaded: true
                    });

                    const { onLoginSuccess } = props;

                    if (onLoginSuccess) {
                        onLoginSuccess(currentUser);
                    }
                }
            );
        }
    );
};

const setFacekbookAsyncInit = (
    props: IFaceBookLoginProps,
    state: IFaceBookLoginState,
    setState: (state: IFaceBookLoginState) => void
): void => {
    getWindow().fbAsyncInit = () => {
        getWindow().FB.init({
            version: `v${props.version}`,
            appId: `${props.appId}`,
            xfbml: false,
            cookie: false
        });

        getWindow().FB.getLoginStatus((response: any) =>
            loginCallback(response, props, state, setState)
        );
    };
};

const loadSdkAsynchronously = (
    props: IFaceBookLoginProps,
    state: IFaceBookLoginState
): void => {
    ((doc: Document, script: string, sdkId: string) => {
        const newScriptElement = doc.createElement(script) as HTMLScriptElement;

        newScriptElement.id = sdkId;
        newScriptElement.src = `https://connect.facebook.net/${
            props.language
        }/sdk.js`;
        doc.head.appendChild(newScriptElement);

        let fbRoot = doc.getElementById('fb-root');
        if (!fbRoot) {
            fbRoot = doc.createElement('div');
            fbRoot.id = 'fb-root';
            doc.body.appendChild(fbRoot);
        }
    })(document, 'script', 'facebook-jssdk');
};

const loginCallback = (
    response: any,
    props: IFaceBookLoginProps,
    state: IFaceBookLoginState,
    setState: (state: IFaceBookLoginState) => void
): void => {
    if (response.authResponse) {
        getUserInfo(props, state, setState, response.authResponse.accessToken);
    } else {
        if (props.onFailure) {
            props.onFailure(response);
        }
    }
};

const logoutCallback = (
    response: any,
    props: IFaceBookLoginProps,
    state: IFaceBookLoginState,
    setState: (state: IFaceBookLoginState) => void
): void => {
    if (response.authResponse) {
        setState({
            ...state,
            isLoggedIn: false,
            facebookUser: undefined
        });

        const { onLogoutSuccess } = props;
        if (onLogoutSuccess) {
            onLogoutSuccess();
        }
    } else {
        if (props.onFailure) {
            props.onFailure(response);
        }
    }
};

export const useFacebookLogin = (
    props: IFaceBookLoginProps
): [IFaceBookLoginState, () => void, () => void] => {
    const [state, setState] = useState<IFaceBookLoginState>({
        isLoggedIn: false,
        loaded: false
    });

    const { appId, fields, language, version } = props;

    const login = (): void => {
        getWindow().FB.login((response: any) =>
            loginCallback(response, props, state, setState)
        );
    };

    const logout = (): void => {
        getWindow().FB.logout((response: any) =>
            logoutCallback(response, props, state, setState)
        );
    };

    useEffect(() => {
        setFacekbookAsyncInit(props, state, setState);
        loadSdkAsynchronously(props, state);
    }, [appId, fields.join(','), language, version]);

    return [state, login, logout];
};
