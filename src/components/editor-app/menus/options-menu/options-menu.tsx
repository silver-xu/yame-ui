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

import '../menu.scss';
import './options-menu.scss';

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
        <React.Fragment>
            <div className="menu generic-menu">
                <div className="container">
                    <h3>Sharing options</h3>
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
            </div>
        </React.Fragment>
    );
};
