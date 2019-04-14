import { library } from '@fortawesome/fontawesome-svg-core';
import { faAdobe } from '@fortawesome/free-brands-svg-icons';
import classnames from 'classnames';
import 'easymde/dist/easymde.min.css';
import React, { useContext, useEffect, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { DialogContext } from '../../../context-providers/dialog-provider';
import { EditorContext } from '../../../context-providers/editor-provider';
import Preview from '../preview';
import { StatusBar } from '../status-bar';
import './editor-pane.scss';
import { AuthContext } from '../../../context-providers/auth-provider';

library.add(faAdobe);

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || '';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export interface IEditorPaneDefaultProps {
    splitScreen: boolean;
    hideToolbars: boolean;
}

export interface IEditorPaneProps extends IEditorPaneDefaultProps {}

export interface IEditorPaneState {
    editorScrollPercentage: number;
    toolbarOutOfFocus: boolean;
    splitScreen: boolean;
    hideToolbars: boolean;
    renderedContent?: string;
    previewInFocus: boolean;
}

let mdeInstance: any;
let previewInFocus: boolean;

export const EditorPane = React.memo((props: IEditorPaneProps) => {
    const {
        docRepo,
        isSaving,
        editorKey,
        updateCurrentDoc,
        renderedContent,
        statistics
    } = useContext(EditorContext);

    const { currentUser } = useContext(AuthContext);

    const { setPublishDialogOpen } = useContext(DialogContext);

    if (!docRepo.currentDoc || !currentUser) {
        return null;
    }

    useEffect(() => {
        previewInFocus = false;
    }, []);

    const [splitScreen, setSplitScreen] = useState<boolean>(props.splitScreen);
    const [hideToolbars, setHideToolbars] = useState<boolean>(
        props.hideToolbars
    );
    const [editorScrollPercentage, setEditorScrollPercentage] = useState<
        number
    >(0);

    const setInstance = (instance: any) => {
        mdeInstance = instance;
        instance.codemirror.setOption('lineNumbers', true);
    };

    const handlePreviewFocus = () => {
        previewInFocus = true;
    };

    const handlePreviewBlur = () => {
        previewInFocus = false;
    };

    const handleEditorScroll = (e: any) => {
        if (!previewInFocus) {
            const scrollPercentage = e.doc.scrollTop / e.doc.height;
            setEditorScrollPercentage(scrollPercentage);
        }
    };

    const handlePreviewScroll = (previewScrollPercentage: number) => {
        if (mdeInstance && previewInFocus) {
            const offsetTop =
                mdeInstance.codemirror.doc.height * previewScrollPercentage;
            mdeInstance.codemirror.scrollTo(0, offsetTop);
        }
    };

    const handleSplitScreenToggle = () => {
        setSplitScreen(!splitScreen);
    };

    const handleToolbarToggle = () => {
        setHideToolbars(!hideToolbars);
    };

    return (
        <div
            className={classnames({
                'editor-container': true,
                'no-toolbar': hideToolbars,
                'editor-only': !splitScreen
            })}
        >
            <div className="editor-wrapper">
                <div className="left-pane">
                    <SimpleMDE
                        key={editorKey}
                        onChange={updateCurrentDoc}
                        getMdeInstance={setInstance}
                        value={docRepo.currentDoc.content}
                        events={{
                            change: () => {},
                            changes: () => {},
                            beforeChange: () => {},
                            cursorActivity: () => {},
                            beforeSelectionChange: () => {},
                            viewportChange: () => {},
                            gutterClick: () => {},
                            focus: () => {},
                            blur: () => {},
                            scroll: handleEditorScroll,
                            update: () => {},
                            renderLine: () => {},
                            mousedown: () => {},
                            dblclick: () => {},
                            touchstart: () => {},
                            contextmenu: () => {},
                            keydown: () => {},
                            keypress: () => {},
                            keyup: () => {},
                            cut: () => {},
                            copy: () => {},
                            paste: () => {},
                            dragstart: () => {},
                            dragenter: () => {},
                            dragover: () => {},
                            dragleave: () => {},
                            drop: () => {}
                        }}
                        options={{
                            status: false,
                            autosave: {
                                enabled: false,
                                uniqueId: 'hackable'
                            },
                            toolbar: [
                                'undo',
                                'redo',
                                '|',
                                'bold',
                                'italic',
                                'strikethrough',
                                '|',
                                'heading-1',
                                'heading-2',
                                'heading-3',
                                '|',
                                'unordered-list',
                                'ordered-list',
                                '|',
                                'code',
                                'link',
                                'image',
                                'table',
                                '|',
                                {
                                    name: 'preview',
                                    action: () => {
                                        window.open(
                                            `${REACT_APP_BASE_URL}/preview/${
                                                docRepo.currentDocId
                                            }`
                                        );
                                    },
                                    className: 'fa fa-compass',
                                    title: 'Preview in browser'
                                },
                                '|',
                                {
                                    name: 'publish',
                                    action: () => {
                                        setPublishDialogOpen(
                                            true,
                                            docRepo.currentDoc
                                        );
                                    },
                                    className: 'fa fa-share-alt',
                                    title: 'Publish to cloud'
                                },
                                {
                                    name: 'pdf',
                                    action: () => {
                                        window.open(
                                            `${API_BASE_URL}/convert/pdf/${
                                                currentUser.id
                                            }/${docRepo.currentDocId}`
                                        );
                                    },
                                    className: 'fa fa-file-pdf-o',
                                    title: 'Download as Adobe PDF'
                                },
                                {
                                    name: 'word',
                                    action: () => {
                                        window.open(
                                            `${API_BASE_URL}/convert/word/${
                                                currentUser.id
                                            }/${docRepo.currentDocId}`
                                        );
                                    },
                                    className: 'fa fa-file-word-o',
                                    title: 'Download as MS Word'
                                }
                            ]
                        }}
                    />
                </div>
                <div className="splitter" />
                <div className="right-pane">
                    {renderedContent && (
                        <Preview
                            scrollPercentage={editorScrollPercentage}
                            previewContent={renderedContent}
                            onScroll={handlePreviewScroll}
                            onFocus={handlePreviewFocus}
                            onMouseOver={handlePreviewFocus}
                            onBlur={handlePreviewBlur}
                        />
                    )}
                </div>
                {statistics ? (
                    <StatusBar
                        onToolbarToggle={handleToolbarToggle}
                        onSplitScreenToggle={handleSplitScreenToggle}
                        charCount={statistics.charCount}
                        lineCount={statistics.lineCount}
                        wordCount={statistics.wordCount}
                        isSaving={isSaving}
                        hideToolbar={hideToolbars}
                        splitScreen={splitScreen}
                    />
                ) : null}
            </div>
        </div>
    );
});
