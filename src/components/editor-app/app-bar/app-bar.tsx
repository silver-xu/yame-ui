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
import React, { useContext, useState } from 'react';
import { EditorContext } from '../../../context-providers/editor-provider';
import { NavContext } from '../../../context-providers/nav-provider';
import './app-bar.scss';
import { BarItem } from './bar-item';
import { CurrentDocumentItem } from './document-item';

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

export enum MenuItem {
    Doc,
    AllDoc,
    Drafts,
    Published,
    Trash
}

export const Appbar = () => {
    const { docRepo, newDoc } = useContext(EditorContext);
    const { activeMenu, setActiveMenu } = useContext(NavContext);

    const handleComposeNewDoc = () => {
        newDoc();
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
                    <CurrentDocumentItem
                        isActive={activeMenu === MenuItem.Doc}
                        onClick={() => setActiveMenu(MenuItem.Doc)}
                    />
                    <BarItem
                        caption="All documents"
                        icon="folder-open"
                        badgeCount={docRepo.availableDocs.length}
                        isActive={activeMenu === MenuItem.AllDoc}
                        onClick={() => setActiveMenu(MenuItem.AllDoc)}
                    />
                    <BarItem
                        caption="Drafts"
                        icon="scroll"
                        badgeCount={docRepo.draftDocs.length}
                        isActive={activeMenu === MenuItem.Drafts}
                        onClick={() => setActiveMenu(MenuItem.Drafts)}
                    />
                    <BarItem
                        caption="Published"
                        icon="share-alt-square"
                        badgeCount={docRepo.publishedDocs.length}
                        isActive={activeMenu === MenuItem.Published}
                        onClick={() => setActiveMenu(MenuItem.Published)}
                    />
                    <BarItem
                        caption="Trash"
                        icon="trash-alt"
                        isActive={activeMenu === MenuItem.Trash}
                        onClick={() => setActiveMenu(MenuItem.Trash)}
                    />
                </ul>
            </div>
        </div>
    );
};
