import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Doc } from '../../../types';

export interface ITileProps {
    doc: Doc;
    isActive: boolean;
    onTileAction: () => void;
    onTileSelected: () => void;
}

export const Tile = (props: ITileProps) => {
    const { doc, onTileAction, onTileSelected, isActive } = props;
    const [markup, setMarkup] = useState<string | undefined>(undefined);

    const renderContent = async () => {
        const rawMarkup = await doc.renderContent();
        const aTagRemoved = rawMarkup
            .replace(/<a[^<]*>/gi, '')
            .replace('</a>', '');
        setMarkup(aTagRemoved);
    };

    useEffect(() => {
        renderContent();
    }, [doc.content]);

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
            </div>
            <div className="tile-name-wrapper">
                <h4>{doc.docName}</h4>
            </div>
        </li>
    ) : null;
};
