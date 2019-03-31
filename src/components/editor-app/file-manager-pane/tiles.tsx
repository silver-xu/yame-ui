import React, { useEffect, useState } from 'react';
import { Doc } from '../../../types';

export interface ITileProps {
    doc: Doc;
}

export const Tile = (props: ITileProps) => {
    const { doc } = props;
    const [markup, setMarkup] = useState<string | undefined>(undefined);

    const renderContent = async () => {
        setMarkup(await doc.renderContent());
    };

    useEffect(() => {
        renderContent();
    }, [doc.content]);

    return markup ? (
        <li className="tile-wrapper">
            <div className="tile">
                <div
                    className="tile-content markdown-body"
                    dangerouslySetInnerHTML={{ __html: markup }}
                />
            </div>
            <h4>{doc.docName}</h4>
        </li>
    ) : null;
};
