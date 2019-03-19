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
import { IPublishResult } from '../../../types';
import {
    CommandButton,
    ExpandableContainer,
    ShareLinks
} from '../side-bar-items';

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

export interface IShareMenuProps {
    shareLink: string;
}

export const ShareMenu = (props: IShareMenuProps) => {
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
                    description="The current document has not been published since last change"
                    heading="Publish Now"
                    icon="external-link-square-alt"
                    disabled={!hasCurrentDocUpdatedSincePublished}
                />
            ) : (
                <ExpandableContainer
                    description="The document has been successfully published"
                    heading="Document Published"
                    icon="cogs"
                    expanded={true}
                >
                    {publishResult && (
                        <ShareLinks publishResult={publishResult} />
                    )}
                </ExpandableContainer>
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
