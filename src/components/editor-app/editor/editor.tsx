import classnames from 'classnames';
import 'easymde/dist/easymde.min.css';
import React, { useContext, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { EditorContext } from '../../../context-providers/editor-provider';
import { MenuContext } from '../../../context-providers/menu-provider';
import { Appbar } from '../app-bar';
import { FileMenu, OptionsMenu, ShareMenu, UserProfileMenu } from '../menus';
import Preview from '../preview';
import { SideBar } from '../side-bar';
import { StatusBar } from '../status-bar';
import { Menu, Toolbar } from '../toolbar';

import './editor.scss';

export interface IEditorDefaultProps {
    splitScreen: boolean;
    hideToolbars: boolean;
}

export interface IEditorProps extends IEditorDefaultProps {}

export interface IEditorState {
    editorScrollPercentage: number;
    toolbarOutOfFocus: boolean;
    splitScreen: boolean;
    hideToolbars: boolean;
    renderedContent?: string;
    previewInFocus: boolean;
}

export const Editor = (props: IEditorProps) => {
    const [editorScrollPercentage, setEditorScrollPercentage] = useState<
        number
    >(0);
    const [splitScreen, setSplitScreen] = useState<boolean>(props.splitScreen);
    const [hideToolbars, setHideToolbars] = useState<boolean>(
        props.hideToolbars
    );

    const [previewInFocus, setPreviewInFocus] = useState<boolean>(false);
    const [mdeInstance, setMdeInstance] = useState<any>(undefined);

    const setInstance = (instance: any) => {
        setMdeInstance(instance);
        instance.codemirror.setOption('lineNumbers', true);
    };

    const handlePreviewFocus = () => {
        setPreviewInFocus(true);
    };

    const handlePreviewBlur = () => {
        setPreviewInFocus(false);
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

    const {
        docRepo,
        isSaving,
        editorKey,
        updateCurrentDoc,
        renderedContent,
        statistics
    } = useContext(EditorContext);

    const { activeMenu, setActiveMenu } = useContext(MenuContext);

    return (
        <div
            className={classnames({
                'editor-container': true,
                'side-bar-open': activeMenu,
                'no-toolbar': hideToolbars,
                'editor-only': !splitScreen
            })}
        >
            <Appbar />
            <div className="editor-wrapper">
                {/* <Toolbar
                    lostFocus={toolbarOutOfFocus}
                    onMenuToggle={setActiveMenu}
                /> */}
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
                                'table'
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
};

Editor.defaultProps = {
    splitScreen: true,
    hideToolbars: false
};
