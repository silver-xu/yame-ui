import React from 'react';
import './share-menu.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faExternalLinkSquareAlt,
    faFilePdf,
    faFileWord
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(faExternalLinkSquareAlt, faFilePdf, faFileWord);

export interface IShareMenuProps {
    shareLink: string;
}

export const ShareMenu = (props: IShareMenuProps) => {
    const { shareLink } = props;
    return (
        <div className="share-menu">
            <div className="command container">
                <h3>The document has not been published to share</h3>
                <div className="publish">
                    <FontAwesomeIcon icon="external-link-square-alt" />
                    Publish Now
                </div>
            </div>
            <div className="container">
                <h3>Please copy the following link to share amongst:</h3>
                <input
                    type="input"
                    className="link"
                    value={shareLink}
                    onFocus={handleLinkFocus}
                />
            </div>
            <div className="container">
                <h3>Options about sharing</h3>
                <div className="field">
                    <FontAwesomeIcon icon="file-word" />
                    <label>Generate MS Word</label>
                    <input type="checkbox" />
                </div>
                <div className="field">
                    <FontAwesomeIcon icon="file-pdf" />
                    <label>Generate Adobe PDF</label>
                    <input type="checkbox" />
                </div>
            </div>
            <div className="container">
                <h3>Secrets</h3>
                <h4>A secret protects wholly or partially the document</h4>
            </div>
        </div>
    );
};

const handleLinkFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.setSelectionRange(0, e.target.value.length);
};
