import Button from '@material-ui/core/Button';
import React from 'react';

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

export const OptionsMenu = () => {
    return (
        <div className="share-menu generic-menu">
            <div className="container">
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
                <h3>Secrets settings</h3>
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
        </div>
    );
};
