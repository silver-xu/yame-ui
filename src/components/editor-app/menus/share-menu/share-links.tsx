import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { DialogContext } from '../../../../context-providers/dialog-provider';
import { IPublishResult } from '../../../../types';
import { Button } from '@material-ui/core';
import { EditorContext } from '../../../../context-providers/editor-provider';

library.add(faPencilAlt);

const BASE_URL = process.env.REACT_APP_BASE_URL || '';

export interface IShareLinksProps {
    publishResult: IPublishResult;
}

export const ShareLinks = (props: IShareLinksProps) => {
    const { normalizedUsername } = props.publishResult;
    const { openNotificationBar } = useContext(DialogContext);
    const { updateCurrentPermalink } = useContext(EditorContext);
    const [editingMode, setEditingMode] = useState<boolean>(false);
    const [permalink, setPermalink] = useState<string>(
        props.publishResult.permalink
    );

    const sharableLink = `${BASE_URL}/${normalizedUsername}/${permalink}`;
    const linkRef = React.createRef<HTMLTextAreaElement>();

    const handleCopy = () => {
        const link = linkRef.current;
        if (link) {
            link.select();
            const copied = document.execCommand('copy');
            if (copied) {
                openNotificationBar(
                    `The sharing link has been copied to clipboard`
                );
            }
        }
    };

    const handleLinkFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.target.select();
    };

    const handleEdit = () => {
        setEditingMode(true);
    };

    const handleCancelEdit = () => {
        setEditingMode(false);
    };

    const handlePermalinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPermalink(e.currentTarget.value);
    };

    const handlePermalinkUpdate = async () => {
        await updateCurrentPermalink(permalink);
        setEditingMode(false);
        openNotificationBar('Permalink has been successfully updated');
    };

    return !editingMode ? (
        <div className="container">
            <h3>
                The document has been published. Please copy and paste the
                following link to share:
            </h3>
            <textarea
                ref={linkRef}
                className="link"
                value={sharableLink}
                onFocus={handleLinkFocus}
            />
            <span onClick={handleCopy} className="link-icon">
                <FontAwesomeIcon icon="copy" />
            </span>
            <span onClick={handleEdit} className="link-icon">
                <FontAwesomeIcon icon="pencil-alt" />
            </span>
        </div>
    ) : (
        <React.Fragment>
            <div className="container">
                <h3>Please update permalink of the document</h3>
                <span className="link">
                    {BASE_URL}/{normalizedUsername}/
                </span>
                <span className="link">
                    <input
                        type="text"
                        defaultValue={permalink}
                        onChange={handlePermalinkChange}
                    />
                </span>
            </div>
            <div className="container buttons">
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handlePermalinkUpdate}
                >
                    Update
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleCancelEdit}
                >
                    Cancel
                </Button>
            </div>
        </React.Fragment>
    );
};
