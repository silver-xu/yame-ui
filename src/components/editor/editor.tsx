import classnames from 'classnames';
import 'easymde/dist/easymde.min.css';
import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { EditorContext } from '../editor-provider/editor-provider';
import { FileMenu } from '../file-menu/file-menu';
import Preview from '../preview';
import { ShareMenu } from '../share-menu';
import { SideBar } from '../side-bar';
import { StatusBar } from '../status-bar';
import { Menu, Toolbar } from '../toolbar';
import { UserProfileMenu } from '../user-profile-menu';
import './editor.scss';

export interface IEditorProps extends IEditorDefaultProps {}

export interface IEditorDefaultProps {
    splitScreen: boolean;
    hideToolbars: boolean;
}

export interface IEditorState {
    editorScrollPercentage: number;
    toolbarOutOfFocus: boolean;
    activeMenu?: Menu;
    splitScreen: boolean;
    hideToolbars: boolean;
}

export class Editor extends Component<IEditorProps, IEditorState> {
    public static defaultProps: IEditorDefaultProps = {
        splitScreen: true,
        hideToolbars: false
    };
    private mdeInstance?: any;
    private previewInFocus: boolean;

    constructor(props: IEditorProps) {
        super(props);

        this.state = {
            editorScrollPercentage: 0,
            toolbarOutOfFocus: true,
            splitScreen: this.props.splitScreen,
            hideToolbars: this.props.hideToolbars
        };
        this.previewInFocus = false;
    }

    public render() {
        const {
            editorScrollPercentage,
            toolbarOutOfFocus,
            activeMenu,
            hideToolbars,
            splitScreen
        } = this.state;

        return (
            <EditorContext.Consumer>
                {({
                    docRepo,
                    isSaving,
                    editorKey,
                    updateCurrentDoc,
                    newDoc,
                    openDoc,
                    removeCurrentDoc,
                    updateCurrentDocName
                }) => (
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
                            onMenuToggle={this.handleMenuToggle}
                            activeMenu={activeMenu}
                        />
                        <div className="left-pane">
                            <SimpleMDE
                                key={editorKey}
                                onChange={updateCurrentDoc}
                                getMdeInstance={this.setInstance}
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
                                    scroll: (e: any) =>
                                        this.handleEditorScroll(e),
                                    update: () => {},
                                    renderLine: () => {},
                                    mousedown: () => {
                                        this.handleEditorAndPreviewClick();
                                    },
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
                            <Preview
                                scrollPercentage={editorScrollPercentage}
                                previewContent={
                                    docRepo.currentDoc.renderedContent
                                }
                                onScroll={this.handlePreviewScroll}
                                onFocus={this.handlePreviewFocus}
                                onBlur={this.handlePreviewBlur}
                                onMouseDown={this.handleEditorAndPreviewClick}
                            />
                        </div>
                        <SideBar isOpen={activeMenu !== undefined}>
                            {activeMenu === Menu.File && (
                                <FileMenu
                                    onNewFileClicked={newDoc}
                                    onFileOpenClicked={openDoc}
                                    onFileRemoveClicked={removeCurrentDoc}
                                    docRepo={docRepo}
                                />
                            )}
                            {activeMenu === Menu.Share && (
                                <ShareMenu shareLink="http://yame.io/silver-xu/resume" />
                            )}
                            {activeMenu === Menu.UserProfile && (
                                <UserProfileMenu />
                            )}
                        </SideBar>
                        <StatusBar
                            onToolbarToggle={this.handleToolbarToggle}
                            onSplitScreenToggle={this.handleSplitScreenToggle}
                            charCount={docRepo.currentDoc.statistics.charCount}
                            lineCount={docRepo.currentDoc.statistics.lineCount}
                            wordCount={docRepo.currentDoc.statistics.wordCount}
                            isSaving={isSaving}
                            hideToolbar={hideToolbars}
                            splitScreen={splitScreen}
                        />
                    </div>
                )}
            </EditorContext.Consumer>
        );
    }

    private handleEditorAndPreviewClick = () => {
        this.setState({
            toolbarOutOfFocus: true
        });
    };

    private handlePreviewFocus = () => {
        this.previewInFocus = true;
    };
    private handlePreviewBlur = () => {
        this.previewInFocus = false;
    };

    private handleEditorScroll = (e: any) => {
        if (!this.previewInFocus) {
            const scrollPercentage = e.doc.scrollTop / e.doc.height;
            this.setState({ editorScrollPercentage: scrollPercentage });
        }
    };

    private setInstance = (instance: any) => {
        this.mdeInstance = instance;
        this.mdeInstance.codemirror.setOption('lineNumbers', true);
    };

    private handlePreviewScroll = (previewScrollPercentage: number) => {
        if (this.mdeInstance && this.previewInFocus) {
            const offsetTop =
                this.mdeInstance.codemirror.doc.height *
                previewScrollPercentage;
            this.mdeInstance.codemirror.scrollTo(0, offsetTop);
        }
    };

    private handleMenuToggle = (menu: Menu) => {
        const { activeMenu } = this.state;
        this.setState({ activeMenu: activeMenu === menu ? undefined : menu });
    };

    private handleSplitScreenToggle = () => {
        this.setState({
            splitScreen: !this.state.splitScreen
        });
    };

    private handleToolbarToggle = () => {
        this.setState({
            hideToolbars: !this.state.hideToolbars
        });
    };
}
