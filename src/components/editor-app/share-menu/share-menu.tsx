import Button from '@material-ui/core/Button';
import React, { useContext, useState } from 'react';
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
import { EditorContext } from '../../../context-providers/editor-provider';
import { CommandButton, ExpandableContainer } from '../side-bar-items';
import { ShareLinks } from './share-links';

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

export const ShareMenu = () => {
    const {
        publishCurrentDoc,
        docRepo,
        publishResult,
        setPublishResult
    } = useContext(EditorContext);

    const hasCurrentDocUpdatedSincePublished = docRepo.hasCurrentDocUpdatedSincePublished();

    const publishDoc = async () => {
        setPublishResult(await publishCurrentDoc());
        docRepo.publishedDocs[docRepo.currentDocId] = docRepo.currentDoc;
    };

    return (
        <div className="share-menu generic-menu">
            <CommandButton
                description="Export the document as Microsoft Word"
                heading="Download as Word"
                icon="file-word"
            />
            <CommandButton
                description="Export the document as Adobe Pdf"
                heading="Download as Pdf"
                icon="file-pdf"
            />
            {hasCurrentDocUpdatedSincePublished ? (
                <CommandButton
                    onClick={publishDoc}
                    description="The current document has not been published since lastest changes."
                    heading="Click to Publish"
                    icon="external-link-square-alt"
                    disabled={!hasCurrentDocUpdatedSincePublished}
                />
            ) : (
                publishResult && <ShareLinks publishResult={publishResult} />
            )}

            <ExpandableContainer
                description="Sharing options"
                heading="Options"
                icon="cogs"
            >
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
            </ExpandableContainer>
        </div>
    );
};
