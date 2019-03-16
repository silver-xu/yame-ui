import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface IShareLinksProps {
    shareLink: string;
}

export const ShareLinks = (props: IShareLinksProps) => {
    const { shareLink } = props;
    return (
        <div className="container">
            <h3>Please copy the following link to share amongst:</h3>
            <input
                type="input"
                className="link"
                value={shareLink}
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
