import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { AuthContext, IAuthContextValue } from '../auth-provider';
import './user-profile-menu.scss';

const responseFacebook = (response: any) => {
    console.log(response);
};

export const UserProfileMenu = () => {
    return (
        <AuthContext.Consumer>
            {(context: IAuthContextValue) => (
                <div className="user-profile">
                    <div>
                        <p>You are using Yame Editor anonymously.</p>
                        <p>
                            Associate your facebook login with Yame to access
                            your document anywhere in the world. Don't worry, we
                            don't have your password.
                        </p>
                    </div>
                    <FacebookLogin
                        appId="330164834292470"
                        cssClass="facebook"
                        autoLoad={true}
                        fields="name,email,picture"
                        callback={responseFacebook}
                    />
                </div>
            )}
        </AuthContext.Consumer>
    );
};
