import classnames from 'classnames';
import 'easymde/dist/easymde.min.css';
import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import uuidv4 from 'uuid/v4';
import { getRepoFromCache } from '../../services/repo-service';
import { DocRepo } from '../../types';
import { FileMenu } from '../file-menu/file-menu';
import Preview from '../preview';
import { SideBar } from '../side-bar';
import Toolbar from '../toolbar';
import './editor.scss';

export interface IEditorState {
    editorScrollPercentage: number;
    toolbarOutOfFocus: boolean;
    fileMenuOpen: boolean;
    docRepo: DocRepo;
    editorKey: string;
}

export class Editor extends Component<{}, IEditorState> {
    private mdeInstance?: any;
    private previewInFocus: boolean;

    constructor(props: IEditorState) {
        super(props);
        const docRepo = getRepoFromCache();
        this.state = {
            editorScrollPercentage: 0,
            toolbarOutOfFocus: true,
            docRepo,
            fileMenuOpen: false,
            editorKey: uuidv4()
        };
        this.previewInFocus = false;
    }

    public render() {
        const {
            editorScrollPercentage,
            toolbarOutOfFocus,
            fileMenuOpen,
            docRepo,
            editorKey
        } = this.state;

        const { renderedContent, statistics } = docRepo.currentDoc;
        const statusText = (
            <React.Fragment>
                Markdown | <b>{statistics.charCount}</b> chars |{' '}
                <b>{statistics.wordCount}</b> words |{' '}
                <b>{statistics.lineCount}</b> lines
            </React.Fragment>
        );

        return (
            <div
                className={classnames({
                    'editor-container': true,
                    'side-bar-open': fileMenuOpen
                })}
            >
                <Toolbar
                    lostFocus={toolbarOutOfFocus}
                    docname={docRepo.currentDoc.docname}
                    onFileMenuToggle={this.handleFileMenuToggle}
                    fileMenuOpen={fileMenuOpen}
                />
                <div className="left-pane">
                    <SimpleMDE
                        key={editorKey}
                        onChange={this.handleEditorChange}
                        getMdeInstance={this.getInstance}
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
                            scroll: (e: any) => this.handleEditorScroll(e),
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
                        previewContent={renderedContent}
                        onScroll={this.handlePreviewScroll}
                        onFocus={this.handlePreviewFocus}
                        onBlur={this.handlePreviewBlur}
                        onMouseDown={this.handleEditorAndPreviewClick}
                    />
                </div>
                <SideBar isOpen={fileMenuOpen}>
                    <FileMenu
                        onNewFileClicked={this.handleNewFileClicked}
                        onFileOpenClicked={this.handleFileOpenClicked}
                        onFileRemoveClicked={this.handleFileRemoveClicked}
                        docRepo={docRepo}
                    />
                </SideBar>
                <div className="status-bar">{statusText}</div>
            </div>
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
    private handleEditorChange = (value: string) => {
        const { docRepo } = this.state;
        docRepo.currentDoc.content = value;
        docRepo.updateDoc(docRepo.currentDoc);
        this.setState({
            docRepo
        });
    };

    private handleEditorScroll = (e: any) => {
        if (!this.previewInFocus) {
            const scrollPercentage = e.doc.scrollTop / e.doc.height;
            this.setState({ editorScrollPercentage: scrollPercentage });
        }
    };

    private getInstance = (instance: any) => {
        this.mdeInstance = instance;
    };

    private handlePreviewScroll = (previewScrollPercentage: number) => {
        if (this.mdeInstance && this.previewInFocus) {
            const offsetTop =
                this.mdeInstance.codemirror.doc.height *
                previewScrollPercentage;
            this.mdeInstance.codemirror.scrollTo(0, offsetTop);
        }
    };

    private handleFileMenuToggle = (fileMenuOpen: boolean) => {
        this.setState({ fileMenuOpen });
    };

    private handleNewFileClicked = () => {
        const { docRepo } = this.state;

        const newDoc = docRepo.newDoc();
        this.setState({
            docRepo
        });
    };

    private handleFileOpenClicked = (id: string) => {
        const { docRepo } = this.state;
        docRepo.openDoc(id);
        this.setState({
            docRepo,
            editorKey: uuidv4()
        });
    };

    private handleFileRemoveClicked = () => {
        const { docRepo } = this.state;
        docRepo.removeDoc(docRepo.currentDoc.id);
        this.setState({
            docRepo
        });
    };
}
