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
import { Badge } from '../../common/badge';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { BarItem } from './bar-item';

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
    const { docRepo, updateCurrentDocName, newDoc } = useContext(EditorContext);
    const { openNotificationBar } = useContext(DialogContext);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [docName, setDocName] = useState<string>(docRepo.currentDoc.docName);

    const handleComposeNewDoc = () => {
        newDoc();
        setDocName(docRepo.currentDoc.docName);
    };

    const handleChangeDocName = () => {
        setEditMode(true);

        setTimeout(() => {
            if (docNameRef.current) {
                docNameRef.current.focus();
            }
        }, 10);
    };

    const handleCancelChangeDocName = () => {
        setEditMode(false);
    };

    const handleDocNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocName(e.currentTarget.value);
    };

    const handleSaveDocName = () => {
        updateCurrentDocName(docName);
        openNotificationBar(`Document name ${docName} has been saved.`);
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleComposeNewDoc}
                >
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
                        <label
                            className="menu-label"
                            onDoubleClick={handleChangeDocName}
                        >
                            {editMode ? (
                                <input
                                    ref={docNameRef}
                                    type="text"
                                    value={docName}
                                    onChange={handleDocNameChange}
                                    maxLength={20}
                                />
                            ) : (
                                <span>{docRepo.currentDoc.docName}</span>
                            )}
                        </label>
                        {editMode && (
                            <>
                                <span
                                    className="cmd"
                                    onClick={handleSaveDocName}
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
                        )}
                    </li>
                    <BarItem
                        caption="All documents"
                        icon="folder-open"
                        badgeCount={docRepo.enumerableDocs.length}
                    />
                    <BarItem
                        caption="Drafts"
                        icon="scroll"
                        badgeCount={
                            docRepo.enumerableDocs.length -
                            docRepo.publishedDocIds.length
                        }
                    />
                    <BarItem
                        caption="Published"
                        icon="share-alt-square"
                        badgeCount={docRepo.publishedDocIds.length}
                    />
                    <BarItem caption="Trash" icon="trash-alt" />
                    <BarItem caption="Settings" icon="cogs" />
                </ul>
            </div>
        </div>
    );
};
