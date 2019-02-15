import React, { Component } from 'react';
import * as showdown from 'showdown';
const showdownHighlight = require('showdown-highlight');

import './preview.scss';
import 'highlight.js/styles/vs.css';
import { render } from 'react-dom';

export interface IPreviewProps {
    content: string;
    scrollPercentage: number;
    onScroll: (scrollPercentage: number) => void;
    onFocus: () => void;
    onBlur: () => void;
}

const converter = new showdown.Converter({
    tables: true,
    smoothLivePreview: true,
    requireSpaceBeforeHeadingText: true,
    extensions: [showdownHighlight]
});

export class Preview extends Component<IPreviewProps> {
    previewRef: React.RefObject<HTMLDivElement>;
    constructor(props: IPreviewProps) {
        super(props);
        this.previewRef = React.createRef();
    }

    public componentDidUpdate() {
        const { scrollPercentage } = this.props;
        if (this.previewRef.current) {
            const topOffset =
                scrollPercentage * this.previewRef.current.scrollHeight;
            this.previewRef.current.scrollTo(0, topOffset);
        }
    }

    public render() {
        const { content, onFocus, onBlur } = this.props;
        const previewContent = converter.makeHtml(content);

        return (
            <div className="preview-wrapper">
                <div className="preview-header" />
                <div
                    ref={this.previewRef}
                    className="preview-pane markdown-body"
                    onScroll={this.handleScroll}
                    onMouseEnter={onFocus}
                    onMouseLeave={onBlur}
                    dangerouslySetInnerHTML={this.injectPreviewMarkup(
                        previewContent
                    )}
                />
            </div>
        );
    }

    private handleScroll = () => {
        if (this.previewRef.current) {
            const scrollPercentage =
                this.previewRef.current.scrollTop /
                this.previewRef.current.scrollHeight;

            this.props.onScroll(scrollPercentage);
        }
    };

    private injectPreviewMarkup = (markup: string) => {
        return { __html: markup };
    };
}
