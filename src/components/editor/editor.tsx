import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import Preview from '../preview';

import 'easymde/dist/easymde.min.css';
import './editor.scss';

export interface IEditorState {
    content: string;
    editorScrollPercentage: number;
}

export class Editor extends Component<{}, IEditorState> {
    private mdeInstance?: any;
    private previewInFocus: boolean;
    constructor(props: IEditorState) {
        super(props);

        this.state = {
            content: 'hello world',
            editorScrollPercentage: 0
        };
        this.previewInFocus = false;
    }

    public render() {
        const {
            content,
            editorScrollPercentage: scrollPercentage
        } = this.state;

        return (
            <div className="editor-container">
                <div className="left-pane">
                    <SimpleMDE
                        value={content}
                        onChange={this.handleEditorChange}
                        getMdeInstance={this.getInstance}
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
                <div className="right-pane">
                    <Preview
                        scrollPercentage={scrollPercentage}
                        content={content}
                        onScroll={this.handlePreviewScroll}
                        onFocus={this.handlePreviewFocus}
                        onBlur={this.handlePreviewBlur}
                    />
                </div>
            </div>
        );
    }

    private handlePreviewFocus = () => {
        this.previewInFocus = true;
    };
    private handlePreviewBlur = () => {
        this.previewInFocus = false;
    };
    private handleEditorChange = (value: string) => {
        this.setState({ content: value });
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
}
