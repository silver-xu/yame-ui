import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
library.add(faSave);

interface IStatusBarProps {
    charCount: number;
    wordCount: number;
    lineCount: number;
    isSaving: boolean;
}

export const StatusBar = (props: IStatusBarProps) => {
    const { charCount, wordCount, lineCount, isSaving } = props;

    const savingIcon = isSaving && <FontAwesomeIcon icon="save" />;
    return (
        <div className="status-bar">
            {savingIcon} | Markdown | <b>{charCount}</b> chars |{' '}
            <b>{wordCount}</b> words | <b>{lineCount}</b> lines
        </div>
    );
};
