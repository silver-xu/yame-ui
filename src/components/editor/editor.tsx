import classnames from 'classnames';
import 'easymde/dist/easymde.min.css';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation, MutationFn, OperationVariables } from 'react-apollo';
import SimpleMDE from 'react-simplemde-editor';
import uuidv4 from 'uuid/v4';
import {
    deriveDocRepoMutation,
    updateDocInRepo
} from '../../services/repo-service';
import { DocRepo, IUser, IDefaultDoc } from '../../types';
import { debounce } from '../../utils/deboune';
import { FileMenu } from '../file-menu/file-menu';
import Preview from '../preview';
import { SideBar } from '../side-bar';
import { StatusBar } from '../status-bar';
import { Ticker } from '../ticker';
import { Menu, Toolbar } from '../toolbar';
import { UserProfileMenu } from '../user-profile-menu';
import './editor.scss';

export interface IEditorProps {
    docRepo: DocRepo;
    currentUser: IUser;
    defaultDoc: IDefaultDoc;
}

export interface IEditorState {
    editorScrollPercentage: number;
    toolbarOutOfFocus: boolean;
    activeMenu?: Menu;
    docRepo: DocRepo;
    editorKey: string;
    isSaving: boolean;
}

export class Editor extends Component<IEditorProps, IEditorState> {
    private mdeInstance?: any;
    private previewInFocus: boolean;
    private unchangedDocRepo: DocRepo;
    private UPDATE_DOC_REPO = gql`
        mutation UpdateDocRepo($docRepoMutation: DocRepoMutation) {
            updateDocRepo(docRepoMutation: $docRepoMutation)
        }
    `;

    constructor(props: IEditorProps) {
        super(props);

        this.state = {
            editorScrollPercentage: 0,
            toolbarOutOfFocus: true,
            editorKey: uuidv4(),
            docRepo: this.props.docRepo,
            isSaving: false
        };
        this.previewInFocus = false;
        this.unchangedDocRepo = this.props.docRepo.clone();
    }

    public render() {
        const {
            editorScrollPercentage,
            toolbarOutOfFocus,
            docRepo,
            editorKey,
            isSaving,
            activeMenu
        } = this.state;

        const { renderedContent, statistics } = docRepo.currentDoc;
        return (
            <Mutation mutation={this.UPDATE_DOC_REPO}>
                {(updateDoc, { data }) => (
                    <div
                        className={classnames({
                            'editor-container': true,
                            'side-bar-open': activeMenu
                        })}
                    >
                        <Toolbar
                            lostFocus={toolbarOutOfFocus}
                            docName={docRepo.currentDoc.docName}
                            onDocNameChange={this.handleDocNameChange}
                            onMenuToggle={this.handleMenuToggle}
                            activeMenu={activeMenu}
                        />
                        <div className="left-pane">
                            <SimpleMDE
                                key={editorKey}
                                onChange={(value: string) =>
                                    this.handleEditorChange(value, updateDoc)
                                }
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
                                previewContent={renderedContent}
                                onScroll={this.handlePreviewScroll}
                                onFocus={this.handlePreviewFocus}
                                onBlur={this.handlePreviewBlur}
                                onMouseDown={this.handleEditorAndPreviewClick}
                            />
                        </div>
                        <SideBar isOpen={activeMenu !== undefined}>
                            {activeMenu === Menu.File && (
                                <FileMenu
                                    onNewFileClicked={() =>
                                        this.handleNewFileClicked(updateDoc)
                                    }
                                    onFileOpenClicked={
                                        this.handleFileOpenClicked
                                    }
                                    onFileRemoveClicked={
                                        this.handleFileRemoveClicked
                                    }
                                    docRepo={docRepo}
                                />
                            )}
                            {activeMenu === Menu.UserProfile && (
                                <UserProfileMenu />
                            )}
                        </SideBar>
                        <StatusBar
                            charCount={statistics.charCount}
                            lineCount={statistics.lineCount}
                            wordCount={statistics.wordCount}
                            isSaving={isSaving}
                        />
                    </div>
                )}
            </Mutation>
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
    private handleEditorChange = (
        value: string,
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
        const { docRepo } = this.state;
        docRepo.currentDoc.content = value;
        docRepo.updateDoc(docRepo.currentDoc);

        this.setState({
            docRepo
        });

        debounce(this.updateDocRepo, 5000)(updateDocMutation);
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

    private handleMenuToggle = (menu: Menu) => {
        const { activeMenu } = this.state;
        this.setState({ activeMenu: activeMenu === menu ? undefined : menu });
    };

    private handleNewFileClicked = (
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
        const { docRepo } = this.state;
        const { defaultDoc } = this.props;

        docRepo.newDoc(defaultDoc);
        this.setState({
            docRepo,
            editorKey: uuidv4()
        });

        this.updateDocRepo(updateDocMutation);
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
            docRepo,
            editorKey: uuidv4()
        });
    };

    private handleDocNameChange = (newDocName: string) => {
        const { docRepo } = this.state;
        docRepo.updateDocName(docRepo.currentDoc, newDocName);
        this.setState({ docRepo });
    };

    private updateDocRepo = (
        updateDocMutation: MutationFn<any, OperationVariables>
    ) => {
        this.setState({ isSaving: true });
        const { docRepo } = this.state;

        const docRepoMutation = deriveDocRepoMutation(
            docRepo,
            this.unchangedDocRepo
        );
        // there is a change
        if (
            docRepoMutation.newDocs.length > 0 ||
            docRepoMutation.updatedDocs.length > 0 ||
            docRepoMutation.deletedDocIds.length > 0
        ) {
            updateDocMutation({
                variables: { docRepoMutation }
            }).then(() => {
                this.unchangedDocRepo = docRepo.clone();
                setTimeout(() => {
                    this.setState({ isSaving: false });
                }, 500);
            });
        }
    };
}
