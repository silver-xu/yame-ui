import { useEffect, useState } from 'react';

export interface IFacebookUser {
    id?: string;
    name?: string;
    email?: string;
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
    onLoginSuccess?: (response: any) => void;
    onLogoutSuccess?: () => void;
}

const getWindow = (): any => {
    return window as any;
};

const getUserInfo = (
    props: IFaceBookLoginProps,
    state: IFaceBookLoginState,
    setState: (state: IFaceBookLoginState) => void
): void => {
    getWindow().FB.api(
        '/me',
        { locale: props.language, fields: props.fields.join(',') },
        (response: any) => {
            const currentUser: IFacebookUser = response;
            setState({
                ...state,
                isLoggedIn: true,
                facebookUser: currentUser,
                loaded: true
            });

            const { onLoginSuccess } = props;

            if (onLoginSuccess) {
                onLoginSuccess(response);
            }
        }
    );
};

const checkLoginCallback = (
    response: any,
    props: IFaceBookLoginProps,
    state: IFaceBookLoginState,
    setState: (state: IFaceBookLoginState) => void
): void => {
    if (response.status === 'connected') {
        getUserInfo(props, state, setState);
    } else {
        setState({
            ...state,
            isLoggedIn: false,
            facebookUser: undefined
        });
    }
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
            checkLoginCallback(response, props, state, setState)
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
        getUserInfo(props, state, setState);
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

    const {
        appId,
        fields,
        language,
        version,
        onLoginSuccess,
        onLogoutSuccess
    } = props;

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
