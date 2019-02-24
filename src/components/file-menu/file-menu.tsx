import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheck,
    faCloudUploadAlt,
    faDownload,
    faFilePdf,
    faFileWord,
    faPlus,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import { DocRepo } from '../../types';
import './file-menu.scss';

library.add(
    faPlus,
    faTrashAlt,
    faCloudUploadAlt,
    faDownload,
    faFilePdf,
    faFileWord,
    faCheck
);

export interface IFileMenuProps {
    docRepo: DocRepo;
    onNewFileClicked: () => void;
    onFileOpenClicked: (id: string) => void;
    onFileRemoveClicked: () => void;
}

export const FileMenu = (props: IFileMenuProps) => {
    const { docRepo, onFileOpenClicked } = props;

    return (
        <div className="file-menu">
            <ul className="menu-header">
                <li onClick={props.onNewFileClicked}>
                    <i>
                        <FontAwesomeIcon icon="plus" />
                    </i>
                </li>
                <li onClick={props.onFileRemoveClicked}>
                    <i>
                        <FontAwesomeIcon icon="trash-alt" />
                    </i>
                </li>
                <li>
                    <i>
                        <FontAwesomeIcon icon="cloud-upload-alt" />
                    </i>
                </li>
                <li>
                    <i>
                        <FontAwesomeIcon icon="download" />
                    </i>
                </li>
                <li>
                    <i>
                        <FontAwesomeIcon icon="file-pdf" />
                    </i>
                </li>
                <li>
                    <i>
                        <FontAwesomeIcon icon="file-word" />
                    </i>
                </li>
            </ul>
            <ul className="file-list">
                {docRepo.sortedDocs.map(doc => (
                    <li
                        key={doc.id}
                        className={classnames({
                            active: docRepo.currentDocId === doc.id
                        })}
                        onClick={() => onFileOpenClicked(doc.id)}
                    >
                        {docRepo.currentDocId === doc.id ? (
                            <i>
                                <FontAwesomeIcon icon="check" />
                            </i>
                        ) : (
                            <i className="placeholder" />
                        )}
                        <span className="doc-name">
                            {doc.docName.length > 0
                                ? doc.docName
                                : 'Untitled file'}
                        </span>
                        <span className="time-span">
                            {doc.friendlyLastModifiedTimespan} ago
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
