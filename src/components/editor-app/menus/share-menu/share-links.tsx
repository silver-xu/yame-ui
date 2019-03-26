import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { DialogContext } from '../../../../context-providers/dialog-provider';
import { EditorContext } from '../../../../context-providers/editor-provider';

library.add(faPencilAlt);

const BASE_URL = process.env.REACT_APP_BASE_URL || '';

export const ShareLinks = React.memo(() => {
    const { openNotificationBar } = useContext(DialogContext);
    const {
        updateCurrentPermalink,
        publishResult,
        setPublishResult
    } = useContext(EditorContext);

    if (!publishResult) {
        return null;
    }

    const [editingMode, setEditingMode] = useState<boolean>(false);
    const [permalink, setPermalink] = useState<string | undefined>(undefined);
    const [originalPermalink, setOriginalPermalink] = useState<
        string | undefined
    >(undefined);

    useEffect(() => {
        setPermalink(publishResult.permalink);
        setOriginalPermalink(publishResult.permalink);
    }, [publishResult.permalink]);

    const { normalizedUsername } = publishResult;

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
        if (permalink) {
            const success = await updateCurrentPermalink(permalink);
            if (success) {
                setOriginalPermalink(permalink);
                setEditingMode(false);
                setPublishResult({
                    ...publishResult,
                    permalink
                });
                openNotificationBar(
                    'Sharing link has been successfully updated'
                );
            } else {
                setPermalink(originalPermalink);
                openNotificationBar(
                    'The link has already been used elsewhere. Please choose another link'
                );
            }
        }
    };

    const linkNode = permalink ? (
        <div className="container">
            <h3>
                The document has been published. Please copy and paste the
                following link to share:
            </h3>
            <textarea
                ref={linkRef}
                className="link"
                defaultValue={sharableLink}
                onFocus={handleLinkFocus}
            />
            <span onClick={handleCopy} className="link-icon">
                <FontAwesomeIcon icon="copy" />
            </span>
            <span onClick={handleEdit} className="link-icon">
                <FontAwesomeIcon icon="pencil-alt" />
            </span>
        </div>
    ) : null;

    const editNode = (
        <>
            <div className="container">
                <h3>Please update permalink of the document</h3>
                <span className="link">
                    {BASE_URL}/{normalizedUsername}/
                </span>
                <span className="link">
                    <input
                        type="text"
                        value={permalink}
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
        </>
    );

    return !editingMode ? linkNode : editNode;
});
