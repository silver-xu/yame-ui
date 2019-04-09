import classnames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { EditorContext } from '../../../context-providers/editor-provider';
import { Doc } from '../../../types';

export interface ITileProps {
    doc: Doc;
    isActive: boolean;

    onTileAction: () => void;
    onTileSelected: () => void;
}

const tileTitleInputRef = React.createRef<HTMLInputElement>();

export const Tile = React.memo((props: ITileProps) => {
    const { doc, onTileAction, onTileSelected, isActive } = props;
    const { updateDocName } = useContext(EditorContext);
    const [markup, setMarkup] = useState<string | undefined>(undefined);
    const [updateTitleMode, setUpdateTitleMode] = useState<boolean>(false);
    const [docName, setDocName] = useState<string>(doc.docName);

    useEffect(() => {
        renderContent();
    }, [doc.content]);

    const renderContent = async () => {
        const rawMarkup = await doc.renderContent();
        const aTagRemoved = rawMarkup
            .replace(/<a[^<]*>/gi, '')
            .replace('</a>', '');
        setMarkup(aTagRemoved);
    };

    const handleTileTitleClicked = () => {
        if (isActive) {
            setUpdateTitleMode(true);

            setImmediate(() => {
                if (tileTitleInputRef.current) {
                    tileTitleInputRef.current.focus();
                }
            });
        }
    };

    const saveDocName = () => {
        updateDocName(doc.id, docName);
        setUpdateTitleMode(false);
    };

    const handleTileTitleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDocName(e.currentTarget.value);
    };

    const handleTileTitleInputKeydown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        switch (e.keyCode) {
            // Enter
            case 13:
                saveDocName();
                break;
            // ESC
            case 27:
                setUpdateTitleMode(false);
                break;
        }
    };

    return markup ? (
        <li
            className={classnames({ 'tile-wrapper': true, active: isActive })}
            onClick={onTileSelected}
        >
            <div className="tile" onDoubleClick={onTileAction}>
                <div
                    className="tile-content thumbnails"
                    dangerouslySetInnerHTML={{ __html: markup }}
                />
                <div className="selection-overlay" />
            </div>
            <div className="tile-name-wrapper">
                {!updateTitleMode ? (
                    <h4 onClick={handleTileTitleClicked}>{doc.docName}</h4>
                ) : (
                    <input
                        type="text"
                        value={docName}
                        ref={tileTitleInputRef}
                        onBlur={saveDocName}
                        onChange={handleTileTitleInputChange}
                        onKeyDown={handleTileTitleInputKeydown}
                    />
                )}
            </div>
        </li>
    ) : null;
});
