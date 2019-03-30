import React from 'react';
import { Doc } from '../../../types';

export interface ITileProps {
    doc: Doc;
}

export const Tile = (props: ITileProps) => {
    const { doc } = props;
    return (
        <li className="tile-wrapper">
            <div className="tile" />
            <h4>{doc.docName}</h4>
        </li>
    );
};
