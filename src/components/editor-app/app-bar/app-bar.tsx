import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCogs,
    faFolderOpen,
    faPen,
    faPenFancy,
    faShareAltSquare,
    faTrashAlt,
    faUserSecret
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button } from '@material-ui/core';
import React from 'react';
import './app-bar.scss';

library.add(
    faUserSecret,
    faPenFancy,
    faFolderOpen,
    faShareAltSquare,
    faTrashAlt,
    faCogs,
    faPen
);

export const Appbar = () => {
    return (
        <div className="app-bar">
            <div className="avatar">
                <Avatar>
                    <FontAwesomeIcon icon={['fas', 'user-secret']} />
                </Avatar>
                <div className="details">
                    <h2>Anonymous</h2>
                    <h3>Click to signin with Facebook</h3>
                </div>
            </div>

            <div className="compose">
                <Button variant="contained" color="primary">
                    <FontAwesomeIcon
                        icon="pen-fancy"
                        className="icon primary"
                    />
                    Compose document
                </Button>
            </div>

            <div className="app-menu">
                <ul>
                    <li className="active">
                        <FontAwesomeIcon icon="pen" className="icon" />
                        Composing...
                    </li>
                    <li>
                        <FontAwesomeIcon icon="folder-open" className="icon" />
                        My documents
                    </li>
                    <li>
                        <FontAwesomeIcon
                            icon="share-alt-square"
                            className="icon"
                        />
                        Published
                    </li>
                    <li>
                        <FontAwesomeIcon icon="trash-alt" className="icon" />
                        Trash bin
                    </li>
                    <li>
                        <FontAwesomeIcon icon="cogs" className="icon" />
                        Settings
                    </li>
                </ul>
            </div>
        </div>
    );
};
