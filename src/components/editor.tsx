import React, { Component } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';

export interface IEditorState {
    value: string;
}

export class Editor extends Component<{}, IEditorState> {
    constructor(props: IEditorState) {
        super(props);

        this.state = {
            value: 'hello world',
        };
    }
    public render() {
        const { value: mdeValue } = this.state;

        return <SimpleMDE onChange={this.handleChange} value={mdeValue} />;
    }

    private handleChange = (value: string) => {
        this.setState({ value: value });
    };
}
