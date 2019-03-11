import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheck,
    faDownload,
    faFile,
    faFilePdf,
    faFileUpload,
    faFileWord,
    faPlus,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import React, { useContext } from 'react';
import { DialogContext } from '../../context-providers/dialog-provider';
import { EditorContext } from '../../context-providers/editor-provider';
import { MenuContext } from '../../context-providers/menu-provider';
import { CommandButton } from '../side-bar-items';
import './file-menu.scss';

library.add(
    faPlus,
    faTrashAlt,
    faFileUpload,
    faDownload,
    faFilePdf,
    faFileWord,
    faFile,
    faCheck
);

export const FileMenu = () => {
    const { setFileManagerOpen } = useContext(DialogContext);
    const { setActiveMenu } = useContext(MenuContext);
    const { newDoc } = useContext(EditorContext);

    const handleNewFileClicked = () => {
        newDoc();
        setActiveMenu(undefined);
    };

    const handleFileManagerOpen = () => {
        setFileManagerOpen(true);
        setActiveMenu(undefined);
    };

    return (
        <div className="file-menu generic-menu">
            <CommandButton
                description="Create a new document"
                heading="New Document"
                icon="plus"
                onClick={handleNewFileClicked}
            />
            <CommandButton
                description="Manage existing document from cloud"
                heading="Open Document Repository"
                icon="file"
                onClick={handleFileManagerOpen}
            />
            <CommandButton
                description="Upload a Markdown file from local drive"
                heading="Upload Markdown"
                icon="file-upload"
            />
        </div>
    );
};
