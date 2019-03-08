import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faColumns,
    faSave,
    faToolbox
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
library.add(faSave, faColumns, faToolbox);
import './status-bar.scss';

export interface IStatusBarProps {
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
            <span>{savingIcon} </span>
            <span className="command">
                <FontAwesomeIcon icon="columns" />
            </span>
            <span className="command">
                <FontAwesomeIcon icon="toolbox" />
            </span>
            <span>Markdown</span>
            <span>
                <b>{charCount}</b> chars
            </span>
            <span>
                <b>{wordCount}</b> words
            </span>
            <span>
                <b>{lineCount}</b> lines
            </span>
        </div>
    );
};
