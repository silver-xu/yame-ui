import classnames from 'classnames';
import 'easymde/dist/easymde.min.css';
import React, { useContext, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { EditorContext } from '../../../context-providers/editor-provider';
import { MenuContext } from '../../../context-providers/menu-provider';
import { FileMenu, OptionsMenu, ShareMenu, UserProfileMenu } from '../menus';
import Preview from '../preview';
import { SideBar } from '../side-bar';
import { StatusBar } from '../status-bar';
import { Menu, Toolbar } from '../toolbar';

import { DialogContext } from '../../../context-providers/dialog-provider';
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
    const [editorState, setEditorState] = useState<IEditorState>({
        editorScrollPercentage: 0,
        toolbarOutOfFocus: true,
        splitScreen: props.splitScreen,
        hideToolbars: props.hideToolbars,
        previewInFocus: false
    });

    let mdeInstance: any;
    const setInstance = (instance: any) => {
        mdeInstance = instance;
        mdeInstance.codemirror.setOption('lineNumbers', true);
    };

    const handlePreviewFocus = () => {
        setEditorState({ ...editorState, previewInFocus: true });
    };

    const handlePreviewBlur = () => {
        setEditorState({ ...editorState, previewInFocus: false });
    };

    const handleEditorScroll = (e: any) => {
        if (!editorState.previewInFocus) {
            const scrollPercentage = e.doc.scrollTop / e.doc.height;
            setEditorState({
                ...editorState,
                editorScrollPercentage: scrollPercentage
            });
        }
    };

    const handlePreviewScroll = (previewScrollPercentage: number) => {
        if (mdeInstance && editorState.previewInFocus) {
            const offsetTop =
                mdeInstance.codemirror.doc.height * previewScrollPercentage;
            mdeInstance.codemirror.scrollTo(0, offsetTop);
        }
    };

    const handleSplitScreenToggle = () => {
        setEditorState({
            ...editorState,
            splitScreen: !editorState.splitScreen
        });
    };

    const handleToolbarToggle = () => {
        setEditorState({
            ...editorState,
            hideToolbars: !editorState.hideToolbars
        });
    };

    const {
        editorScrollPercentage,
        toolbarOutOfFocus,
        hideToolbars,
        splitScreen
    } = editorState;

    const {
        docRepo,
        isSaving,
        editorKey,
        updateCurrentDoc,
        renderedContent,
        statistics
    } = useContext(EditorContext);

    const { setRegisterUserOpen } = useContext(DialogContext);
    setRegisterUserOpen(true);

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
            <Toolbar
                lostFocus={toolbarOutOfFocus}
                onMenuToggle={setActiveMenu}
            />
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
            <SideBar>
                <React.Fragment>
                    {activeMenu === Menu.File && <FileMenu />}
                    {activeMenu === Menu.Share && <ShareMenu />}
                    {activeMenu === Menu.Options && <OptionsMenu />}
                    {activeMenu === Menu.UserProfile && <UserProfileMenu />}
                </React.Fragment>
            </SideBar>
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
    );
};

Editor.defaultProps = {
    splitScreen: true,
    hideToolbars: false
};
