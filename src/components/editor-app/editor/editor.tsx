import classnames from 'classnames';
import React, { useContext } from 'react';
import {
    EditorContext,
    EditorMode
} from '../../../context-providers/editor-provider';
import { Appbar } from '../app-bar';
import EditorPane from '../editor-pane';
import { FileManagerPane } from '../file-manager-pane';

import './editor.scss';

export const Editor = () => {
    const { editorMode } = useContext(EditorContext);
    return (
        <>
            <Appbar />
            <div className="main-container">
                {editorMode === EditorMode.Editing ? (
                    <EditorPane splitScreen={true} hideToolbars={false} />
                ) : (
                    <FileManagerPane />
                )}
            </div>
        </>
    );
};
