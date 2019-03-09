import classnames from 'classnames';
import React, { useContext } from 'react';
import { CommandButton } from '../../side-bar-items';
import { UserType } from '../../types';
import { AuthContext } from '../auth-provider';

export const UserProfileMenu = () => {
    const { currentUser, login, logout } = useContext(AuthContext);

    return (
        <div className="user-profile generic-menu">
            {currentUser && currentUser.userType === UserType.Anonymous ? (
                <CommandButton
                    description="Login to yame using your facebook account to access your documents everywhere"
                    heading="Login to Facebook"
                    icon={['fab', 'facebook-square']}
                    onClick={login}
                />
            ) : (
                <CommandButton
                    description="Sign out from yame. You will no longer able to access your documents on a different computer"
                    heading="Logout from Facebook"
                    icon={['fas', 'user-secret']}
                    onClick={logout}
                />
            )}
        </div>
    );
};
