import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { EditorContext } from '../../../context-providers/editor-provider';

library.add(faFileAlt, faPen);

const docNameRef = React.createRef<HTMLInputElement>();

export interface ICurrentDocumentItemProps {
    isActive: boolean;
    onClick: () => void;
}

export const CurrentDocumentItem = React.memo(
    (props: ICurrentDocumentItemProps) => {
        const { docRepo, updateCurrentDocName } = useContext(EditorContext);

        const { openNotificationBar } = useContext(DialogContext);
        const [editMode, setEditMode] = useState<boolean>(false);
        const [docName, setDocName] = useState<string | undefined>(undefined);

        useEffect(() => {
            setDocName(docRepo.currentDoc && docRepo.currentDoc.docName);
        }, [docRepo.currentDoc && docRepo.currentDoc.docName]);

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

        const handleDocNameChange = (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            setDocName(e.currentTarget.value);
        };

        const handleSaveDocName = () => {
            if (docName) {
                updateCurrentDocName(docName);
                openNotificationBar(
                    `Document name has been updated to ${docName}`
                );
                setEditMode(false);
            }
        };

        return docRepo.currentDoc ? (
            <li
                className={classnames({ active: props.isActive })}
                onClick={props.onClick}
            >
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
                        <span className="cmd" onClick={handleSaveDocName}>
                            <FontAwesomeIcon icon="save" />
                        </span>
                        <span
                            className="cmd"
                            onClick={handleCancelChangeDocName}
                        >
                            <FontAwesomeIcon icon="ban" />
                        </span>
                    </>
                )}
            </li>
        ) : null;
    }
);
