import classnames from 'classnames';
import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { IUser, UserType } from '../../types';
import { AuthContext, IAuthContextValue } from '../auth-provider';
import './user-profile-menu.scss';

export interface IUserProfileMenuProps {
    currentUser: IUser;
}

export const UserProfileMenu = (props: IUserProfileMenuProps) => {
    return (
        <AuthContext.Consumer>
            {(context: IAuthContextValue) => {
                const { currentUser } = props;

                return (
                    <div className="user-profile">
                        <div
                            className={classnames({
                                hide:
                                    currentUser.userType !== UserType.Anonymous
                            })}
                        >
                            <div>
                                <p>You are using Yame Editor anonymously.</p>
                                <p>
                                    Associate your facebook login with Yame to
                                    access your document anywhere in the world.
                                    Don't worry, we don't have your password.
                                </p>
                            </div>
                            <FacebookLogin
                                appId="330164834292470"
                                cssClass="facebook"
                                autoLoad={true}
                                fields="name,email,picture"
                                callback={response => {
                                    context.updateAuthToken(
                                        response.accessToken
                                    );
                                }}
                            />
                        </div>
                        <div
                            className={classnames({
                                hide:
                                    currentUser.userType === UserType.Anonymous
                            })}
                        >
                            <p>
                                You are currently logged in as{' '}
                                <b>{currentUser.userName}</b> using Facebook.
                            </p>
                            <p>Process the logout button below to logout</p>
                            <button
                                className="facebook"
                                onClick={() => logout(currentUser)}
                            >
                                Logout from facebook
                            </button>
                        </div>
                    </div>
                );
            }}
        </AuthContext.Consumer>
    );
};

const logout = (currentUser: IUser) => {
    (window as any).FB.api(
        `me/permissions?success:true&access_token=${currentUser.authToken}`,
        'delete',
        (response: any) => {
            console.log(response);
        }
    );
};
