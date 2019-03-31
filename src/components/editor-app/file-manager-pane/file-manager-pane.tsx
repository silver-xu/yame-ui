import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faFolderOpen,
    faSearch,
    faShareAlt,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { EditorContext } from '../../../context-providers/editor-provider';
import './file-manager-pane.scss';
import { Tile } from './tiles';

library.add(faSearch, faTrashAlt, faFolderOpen, faShareAlt);
export const FileManagerPane = () => {
    const { docRepo } = useContext(EditorContext);

    return (
        <>
            <div className="toolbar">
                <FontAwesomeIcon icon="search" />
                <input type="text" className="search-bar" />
                <ul className="extra-tools">
                    <li>
                        <FontAwesomeIcon icon="folder-open" />
                    </li>
                    <li>
                        <FontAwesomeIcon icon="trash-alt" />
                    </li>
                    <li>
                        <FontAwesomeIcon icon="share-alt" />
                    </li>
                </ul>
            </div>
            <ul className="tiles">
                {docRepo.sortedDocs.map(doc => (
                    <Tile doc={doc} />
                ))}
            </ul>
        </>
    );
};
