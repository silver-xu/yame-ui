import React, { useContext } from 'react';
import { EditorContext } from '../../../context-providers/editor-provider';
import './file-manager-pane.scss';

export const FileManagerPane = () => {
    const { docRepo } = useContext(EditorContext);

    return (
        <ul>
            {docRepo.sortedDocs.map(doc => (
                <li>{doc.docName}</li>
            ))}
        </ul>
    );
};
