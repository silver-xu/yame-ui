import { library } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { IPublishResult } from '../../../types';

library.add(faPencilAlt);

const BASE_URL = process.env.REACT_APP_BASE_URL || '';

export interface IShareLinksProps {
    publishResult: IPublishResult;
}

export const ShareLinks = (props: IShareLinksProps) => {
    const { normalizedUsername, permalink } = props.publishResult;
    const { openNotificationBar } = useContext(DialogContext);
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

    return (
        <div className="container">
            <h3>Please copy and paste the following link to share:</h3>
            <textarea
                ref={linkRef}
                className="link"
                value={sharableLink}
                onFocus={handleLinkFocus}
            />
            <span onClick={handleCopy} className="link-icon">
                <FontAwesomeIcon icon="copy" />
            </span>
            <span className="link-icon">
                <FontAwesomeIcon icon="pencil-alt" />
            </span>
        </div>
    );
};
