import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faColumns,
    faSave,
    faToolbox
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
library.add(faSave, faColumns, faToolbox);
import classnames from 'classnames';
import './status-bar.scss';

export interface IStatusBarProps {
    onToolbarToggle: () => void;
    onSplitScreenToggle: () => void;
    charCount: number;
    wordCount: number;
    lineCount: number;
    isSaving: boolean;
    hideToolbar: boolean;
    splitScreen: boolean;
}

export const StatusBar = (props: IStatusBarProps) => {
    const {
        charCount,
        wordCount,
        lineCount,
        isSaving,
        hideToolbar,
        splitScreen
    } = props;

    const savingIcon = isSaving && <FontAwesomeIcon icon="save" />;
    return (
        <div className="status-bar">
            <span>{savingIcon} </span>
            <span
                className={classnames({
                    command: true,
                    active: splitScreen
                })}
                onClick={props.onSplitScreenToggle}
            >
                <FontAwesomeIcon icon="columns" />
            </span>
            <span
                className={classnames({
                    command: true,
                    active: !hideToolbar
                })}
                onClick={props.onToolbarToggle}
            >
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
