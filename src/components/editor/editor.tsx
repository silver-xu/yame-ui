import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import Preview from '../preview';
import CodeMirror from 'react-simplemde-editor/typings';

import 'simplemde/dist/simplemde.min.css';
import './editor.scss';

export interface IEditorState {
    content: string;
    scrollPercentage: number;
}

export class Editor extends Component<{}, IEditorState> {
    constructor(props: IEditorState) {
        super(props);

        this.state = {
            content: 'hello world',
            scrollPercentage: 0
        };
    }

    public render() {
        const { content, scrollPercentage } = this.state;

        return (
            <div className="editor-container">
                <div className="left-pane">
                    <SimpleMDE
                        value={content}
                        onChange={this.handleChange}
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
                    />
                </div>
            </div>
        );
    }

    private handleChange = (value: string) => {
        this.setState({ content: value });
    };

    private handleScroll = (e: any) => {
        const scrollPercentage = e.doc.scrollTop / e.doc.height;
        this.setState({ scrollPercentage });
    };
}
