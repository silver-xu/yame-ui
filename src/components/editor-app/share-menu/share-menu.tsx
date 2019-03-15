import Button from '@material-ui/core/Button';
import React, { useContext } from 'react';
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
import {
    CommandButton,
    ExpandableContainer,
    ShareLinks
} from '../side-bar-items';
import { EditorContext } from '../../../context-providers/editor-provider';

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
    const { shareLink } = props;
    const { publishCurrentDoc: publishDoc } = useContext(EditorContext);
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
            <CommandButton
                onClick={publishDoc}
                description="Please publish first to obtain sharing links"
                heading="Publish Now"
                icon="external-link-square-alt"
            />
            <ShareLinks shareLink={shareLink} />
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
