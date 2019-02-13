import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import Preview from '../preview';

import 'easymde/dist/easymde.min.css';
import './editor.scss';
import SimpleMDEEditor from 'react-simplemde-editor';

export interface IEditorState {
    content: string;
    editorScrollPercentage: number;
}

export class Editor extends Component<{}, IEditorState> {
    private mdeInstance?: any;
    private editorInFocus: boolean;
    constructor(props: IEditorState) {
        super(props);

        this.state = {
            content: 'hello world',
            editorScrollPercentage: 0
        };
        this.editorInFocus = false;
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
                        onChange={this.handleChange}
                        getMdeInstance={this.getInstance}
                        events={{
                            change: () => {},
                            changes: () => {},
                            beforeChange: () => {},
                            cursorActivity: () => {},
                            beforeSelectionChange: () => {},
                            viewportChange: () => {},
                            gutterClick: () => {},
                            focus: () => {
                                this.handleFocus;
                            },
                            blur: () => {
                                this.handleBlur;
                            },
                            scroll: (e: any) => this.handleScroll(e),
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
                            }
                        }}
                    />
                </div>
                <div className="right-pane">
                    <Preview
                        scrollPercentage={scrollPercentage}
                        content={content}
                        onScroll={this.handlePreviewScroll}
                    />
                </div>
            </div>
        );
    }

    private handleFocus = () => {
        this.editorInFocus = true;
    };
    private handleBlur = () => {
        this.editorInFocus = false;
    };
    private handleChange = (value: string) => {
        this.setState({ content: value });
    };

    private handleScroll = (e: any) => {
        if (this.editorInFocus) {
            const scrollPercentage = e.doc.scrollTop / e.doc.height;
            this.setState({ editorScrollPercentage: scrollPercentage });
        }
    };

    private getInstance = (instance: any) => {
        // You can now store and manipulate the simplemde instance.
        this.mdeInstance = instance;
    };

    private handlePreviewScroll = (previewScrollPercentage: number) => {
        if (this.mdeInstance) {
            const offsetTop =
                this.mdeInstance.codemirror.doc.height *
                previewScrollPercentage;
            this.mdeInstance.codemirror.scrollTo(0, offsetTop);
        }
    };
}
