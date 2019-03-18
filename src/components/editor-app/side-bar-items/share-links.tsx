import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { IPublishResult } from '../../../types';

const BASE_URL = process.env.REACT_APP_BASE_URL || '';

export interface IShareLinksProps {
    publishResult: IPublishResult;
}

export const ShareLinks = (props: IShareLinksProps) => {
    const { normalizedUsername, permalink } = props.publishResult;
    const sharableLink = `${BASE_URL}/${normalizedUsername}/${permalink}`;

    return (
        <div className="container">
            <h3>Please copy the following link to share amongst:</h3>
            <input
                type="input"
                className="link"
                value={sharableLink}
                onFocus={handleLinkFocus}
            />
            <FontAwesomeIcon icon="copy" />
            <FontAwesomeIcon icon="pen-alt" />
        </div>
    );
};

const handleLinkFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.setSelectionRange(0, e.target.value.length);
};
