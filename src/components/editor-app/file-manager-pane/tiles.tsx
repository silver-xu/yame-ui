import React, { useEffect, useState } from 'react';
import { Doc } from '../../../types';

export interface ITileProps {
    doc: Doc;
}

export const Tile = (props: ITileProps) => {
    const { doc } = props;
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
        <li className="tile-wrapper">
            <div className="tile">
                <div
                    className="tile-content thumbnails"
                    dangerouslySetInnerHTML={{ __html: markup }}
                />
            </div>
            <h4>{doc.docName}</h4>
        </li>
    ) : null;
};
