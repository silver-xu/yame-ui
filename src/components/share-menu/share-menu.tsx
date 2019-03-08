import Button from '@material-ui/core/Button';
import React from 'react';
import './share-menu.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCogs,
    faCopy,
    faExternalLinkSquareAlt,
    faFileAlt,
    faFilePdf,
    faFileWord,
    faNewspaper,
    faPenAlt,
    faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(
    faExternalLinkSquareAlt,
    faFilePdf,
    faFileWord,
    faUnlockAlt,
    faCopy,
    faPenAlt,
    faFileAlt,
    faNewspaper,
    faCogs
);

import { ExpandableContainer } from './expandable-container';

export interface IShareMenuProps {
    shareLink: string;
}

export const ShareMenu = (props: IShareMenuProps) => {
    const { shareLink } = props;
    return (
        <div className="share-menu">
            <div className="command container">
                <h3>Please publish first to obtain sharing links</h3>
                <div className="primary">
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
                <FontAwesomeIcon icon="copy" />
                <FontAwesomeIcon icon="pen-alt" />
            </div>

            <ExpandableContainer
                description="Options about sharing"
                heading="Options"
                icon="cogs"
            >
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
                    <div className="field">
                        <FontAwesomeIcon icon="unlock-alt" />
                        <label>Protect doc with a Secret</label>
                        <input type="checkbox" />
                    </div>
                </div>
                <div className="container">
                    <h3>Secrets</h3>
                    <h4>Secret phrase to protect the document</h4>
                    <input
                        type="text"
                        className="secret"
                        placeholder="Please enter secret phrase"
                    />
                    <h3>Options about secrets</h3>
                    <div className="field">
                        <FontAwesomeIcon icon="file-alt" />
                        <label>Protect the document</label>
                        <input type="radio" />
                    </div>
                    <div className="field">
                        <FontAwesomeIcon icon="newspaper" className="narrow" />
                        <label>Protect sections</label>
                        <input type="radio" />
                    </div>
                    <div className="field">
                        <FontAwesomeIcon icon="file-pdf" />
                        <label>Protect Word / PDF Downlads</label>
                        <input type="checkbox" />
                    </div>
                </div>
                <div className="container buttons">
                    <Button variant="contained" color="primary" size="small">
                        Update
                    </Button>
                    <Button variant="contained" size="small">
                        Cancel
                    </Button>
                </div>
            </ExpandableContainer>
        </div>
    );
};

const handleLinkFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.setSelectionRange(0, e.target.value.length);
};
