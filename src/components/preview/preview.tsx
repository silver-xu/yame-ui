import React, { Component } from 'react';

import 'highlight.js/styles/vs.css';
import './preview.scss';

export interface IPreviewProps {
    previewContent: string;
    scrollPercentage: number;
    onScroll: (scrollPercentage: number) => void;
    onFocus: () => void;
    onBlur: () => void;
    onMouseOver: () => void;
}

export class Preview extends Component<IPreviewProps> {
    public previewRef: React.RefObject<HTMLDivElement>;
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
        const {
            previewContent: content,
            onFocus,
            onBlur,
            onMouseOver
        } = this.props;

        return (
            <div className="preview-wrapper">
                <div
                    ref={this.previewRef}
                    className="preview-pane markdown-body"
                    onScroll={this.handleScroll}
                    onMouseEnter={onFocus}
                    onMouseLeave={onBlur}
                    onMouseOver={onMouseOver}
                    dangerouslySetInnerHTML={this.injectPreviewMarkup(content)}
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
