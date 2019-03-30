import React, { useContext } from 'react';
import { EditorContext } from '../../../context-providers/editor-provider';
import './file-manager-pane.scss';
import { Tile } from './tiles';

export const FileManagerPane = () => {
    const { docRepo } = useContext(EditorContext);

    return (
        <ul className="tiles">
            {docRepo.sortedDocs.map(doc => (
                <Tile doc={doc} />
            ))}
        </ul>
    );
};
