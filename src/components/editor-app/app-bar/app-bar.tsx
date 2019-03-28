import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faBan,
    faCogs,
    faFileAlt,
    faFolderOpen,
    faPen,
    faPenFancy,
    faSave,
    faScroll,
    faShareAltSquare,
    faTrashAlt,
    faUserSecret
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button } from '@material-ui/core';
import classnames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
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
    faFileAlt,
    faSave,
    faBan
);

const docNameRef = React.createRef<HTMLInputElement>();

export const Appbar = () => {
    const { docRepo } = useContext(EditorContext);
    const [editMode, setEditMode] = useState<boolean>(false);

    const handleChangeDocName = () => {
        setEditMode(true);

        setTimeout(() => {
            if (docNameRef.current) {
                docNameRef.current.select();
                docNameRef.current.focus();
            }
        }, 10);
    };

    const handleCancelChangeDocName = () => {
        setEditMode(false);
    };

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
                            {editMode ? (
                                <input
                                    ref={docNameRef}
                                    type="text"
                                    value={docRepo.currentDoc.docName}
                                />
                            ) : (
                                <span>{docRepo.currentDoc.docName}</span>
                            )}
                        </label>
                        {editMode ? (
                            <>
                                <span
                                    className="cmd"
                                    onClick={handleChangeDocName}
                                >
                                    <FontAwesomeIcon
                                        icon="save"
                                        className="icon"
                                    />
                                </span>
                                <span
                                    className="cmd"
                                    onClick={handleCancelChangeDocName}
                                >
                                    <FontAwesomeIcon
                                        icon="ban"
                                        className="icon"
                                    />
                                </span>
                            </>
                        ) : (
                            <span className="cmd" onClick={handleChangeDocName}>
                                <FontAwesomeIcon icon="pen" className="icon" />
                            </span>
                        )}
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
