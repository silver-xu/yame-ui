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
import { MenuContext } from '../../context-providers/menu-provider';
import { DocRepo } from '../../types';
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

export interface IFileMenuProps {
    docRepo: DocRepo;
    onNewFileClicked: () => void;
    onFileOpenClicked: (id: string) => void;
    onFileRemoveClicked: () => void;
}

export const FileMenu = (props: IFileMenuProps) => {
    const { onNewFileClicked } = props;

    const { setFileManagerOpen } = useContext(DialogContext);
    const { setActiveMenu } = useContext(MenuContext);

    const handleNewFileClicked = () => {
        onNewFileClicked();
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
                description="Open an existing document from cloud"
                heading="Open a Document"
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

    // return (
    //     <div className="file-menu">
    //         <ul className="menu-header">
    //             <li onClick={props.onNewFileClicked}>
    //                 <i>
    //                     <FontAwesomeIcon icon="plus" />
    //                 </i>
    //             </li>
    //             <li onClick={props.onFileRemoveClicked}>
    //                 <i>
    //                     <FontAwesomeIcon icon="trash-alt" />
    //                 </i>
    //             </li>
    //             <li>
    //                 <i>
    //                     <FontAwesomeIcon icon="file-upload" />
    //                 </i>
    //                 <input type="file" accept=".md,.markdown" />
    //             </li>
    //             <li>
    //                 <i>
    //                     <FontAwesomeIcon icon="download" />
    //                 </i>
    //             </li>
    //             <li>
    //                 <i>
    //                     <FontAwesomeIcon icon="file-pdf" />
    //                 </i>
    //             </li>
    //             <li>
    //                 <i>
    //                     <FontAwesomeIcon icon="file-word" />
    //                 </i>
    //             </li>
    //         </ul>
    //         <ul className="file-list">
    //             {docRepo.sortedDocs.map(doc => (
    //                 <li
    //                     key={doc.id}
    //                     className={classnames({
    //                         active: docRepo.currentDocId === doc.id
    //                     })}
    //                     onClick={() => onFileOpenClicked(doc.id)}
    //                 >
    //                     {docRepo.currentDocId === doc.id ? (
    //                         <i>
    //                             <FontAwesomeIcon icon="check" />
    //                         </i>
    //                     ) : (
    //                         <i className="placeholder" />
    //                     )}
    //                     <span className="doc-name">
    //                         {doc.docName.length > 0
    //                             ? doc.docName
    //                             : 'Untitled file'}
    //                     </span>
    //                     <span className="time-span">
    //                         {doc.friendlyLastModifiedTimespan} ago
    //                     </span>
    //                 </li>
    //             ))}
    //         </ul>
    //     </div>
    // );
};
