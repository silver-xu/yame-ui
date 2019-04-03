import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React, { useContext } from 'react';

import { EditorContext } from '../../../context-providers/editor-provider';
import { NavContext } from '../../../context-providers/nav-provider';
import { MenuItem } from './app-bar';

library.add(faFileAlt, faTimes);

export interface ICurrentDocumentItemProps {
    isActive: boolean;
    onClick: () => void;
}

export const CurrentDocumentItem = React.memo(
    (props: ICurrentDocumentItemProps) => {
        const { docRepo, closeCurrentDoc } = useContext(EditorContext);
        const { setActiveMenu } = useContext(NavContext);

        const handleClose = (e: React.MouseEvent) => {
            e.stopPropagation();
            closeCurrentDoc();
            setActiveMenu(MenuItem.AvailableDocs);
        };

        return docRepo.currentDoc ? (
            <li
                className={classnames({ active: props.isActive })}
                onClick={props.onClick}
            >
                <FontAwesomeIcon icon="file-alt" className="icon" />
                <label className="menu-label">
                    <span>{docRepo.currentDoc.docName}</span>
                </label>

                <span className="cmd" onClick={handleClose}>
                    <FontAwesomeIcon icon="times" />
                </span>
            </li>
        ) : null;
    }
);
