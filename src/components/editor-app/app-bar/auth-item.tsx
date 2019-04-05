import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@material-ui/core';
import React, { useContext } from 'react';
import { AuthContext } from '../../../context-providers/auth-provider';
import { UserType } from '../../../types';

library.add(faFacebook);

export const AuthItem = React.memo(() => {
    const { currentUser, login, logout } = useContext(AuthContext);

    return currentUser && currentUser.userType !== UserType.Facebook ? (
        <div className="avatar" onClick={login}>
            <Avatar className="avatar-img">
                <FontAwesomeIcon icon={['fas', 'user-secret']} />
            </Avatar>
            <div className="details">
                <h2>Anonymous</h2>
                <h3>Click to signin with Facebook</h3>
            </div>
        </div>
    ) : (
        <div className="avatar" onClick={logout}>
            <Avatar className="avatar-img">
                <img
                    src={
                        currentUser &&
                        currentUser.avatar &&
                        currentUser.avatar.url
                    }
                />
            </Avatar>
            <div className="details">
                <h2>{currentUser && currentUser.userName}</h2>
                <h3>Click to signout from Facebook</h3>
            </div>
        </div>
    );
});
