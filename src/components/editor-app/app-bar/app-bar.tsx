import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCogs,
    faFileAlt,
    faFolderOpen,
    faPen,
    faPenFancy,
    faScroll,
    faShareAltSquare,
    faTrashAlt,
    faUserSecret
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { EditorContext } from '../../../context-providers/editor-provider';
import './app-bar.scss';

library.add(
    faUserSecret,
    faPenFancy,
    faFolderOpen,
    faShareAltSquare,
    faTrashAlt,
    faCogs,
    faPen,
    faScroll,
    faFileAlt
);

export const Appbar = () => {
    const { docRepo } = useContext(EditorContext);

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
                        <FontAwesomeIcon icon="file-alt" className="icon" />
                        <label className="menu-label">
                            {docRepo.currentDoc.docName}
                        </label>
                        <span className="cmd">
                            <FontAwesomeIcon icon="pen" className="icon" />
                        </span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon="folder-open" className="icon" />
                        <label className="menu-label">All documents</label>
                        <span className="count">
                            {docRepo.enumerableDocs.length > 0 &&
                                `(${docRepo.enumerableDocs.length})`}
                        </span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon="scroll" className="icon" />
                        <label className="menu-label">Drafts</label>
                    </li>
                    <li>
                        <FontAwesomeIcon
                            icon="share-alt-square"
                            className="icon"
                        />
                        <label className="menu-label">Published</label>
                    </li>
                    <li>
                        <FontAwesomeIcon icon="trash-alt" className="icon" />
                        <label className="menu-label">Trash</label>
                    </li>
                    <li>
                        <FontAwesomeIcon icon="cogs" className="icon" />
                        <label className="menu-label">Settings</label>
                    </li>
                </ul>
            </div>
        </div>
    );
};
