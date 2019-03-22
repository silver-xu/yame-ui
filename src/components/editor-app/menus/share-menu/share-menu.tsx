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
import React, { useContext } from 'react';
import { EditorContext } from '../../../../context-providers/editor-provider';
import { CommandButton } from '../../side-bar-items';
import { ShareLinks } from './share-links';

import { DialogContext } from '../../../../context-providers/dialog-provider';
import '../menu.scss';
import './share-menu.scss';

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
    const { openNotificationBar } = useContext(DialogContext);

    const hasCurrentDocUpdatedSincePublished = docRepo.hasCurrentDocUpdatedSincePublished();

    const publishDoc = async () => {
        setPublishResult(await publishCurrentDoc());
        docRepo.publishedDocs[docRepo.currentDocId] = docRepo.currentDoc;
        openNotificationBar('Document has been successfully published');
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
                    description="The document has not been published since last change. Please publish to get the sharing link"
                    heading="Publish now"
                    icon="external-link-square-alt"
                    disabled={!hasCurrentDocUpdatedSincePublished}
                />
            ) : (
                <ShareLinks />
            )}
        </div>
    );
};
