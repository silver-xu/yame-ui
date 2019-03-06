import classnames from 'classnames';
import React, { useContext } from 'react';
import { UserType } from '../../types';
import { AuthContext } from '../auth-provider';
import './user-profile-menu.scss';

export const UserProfileMenu = () => {
    const { currentUser, login, logout } = useContext(AuthContext);

    return (
        <div className="user-profile">
            <div
                className={classnames({
                    hide:
                        currentUser &&
                        currentUser.userType !== UserType.Anonymous
                })}
            >
                <div>
                    <p>You are using Yame Editor anonymously.</p>
                    <p>
                        Associate your facebook login with Yame to access your
                        document anywhere in the world. Don't worry, we don't
                        have your password.
                    </p>
                    <button onClick={login} className="facebook">
                        Login to Facebook
                    </button>
                </div>
            </div>
            <div
                className={classnames({
                    hide:
                        currentUser &&
                        currentUser.userType === UserType.Anonymous
                })}
            >
                <p>
                    You are currently logged in as{' '}
                    <b>{currentUser && currentUser.userName}</b> using Facebook.
                </p>
                <p>Process the logout button below to logout</p>
                <button onClick={logout} className="facebook">
                    Logout from Facebook
                </button>
            </div>
        </div>
    );
};
