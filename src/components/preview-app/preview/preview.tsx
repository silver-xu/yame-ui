import React, { useContext } from 'react';
import { IContentNode } from '../../../types/doc';
import { Nav } from '../../common/nav';
import { ScrollPane } from '../../common/scroll-pane';
import { ViewContext } from '../../common/view-provider/view-provider';

import './preview.scss';

export interface INodeDom {
    node: IContentNode;
    dom: Element;
}

export const Preview = () => {
    const { doc } = useContext(ViewContext);
    return (
        <div className="preview">
            <div className="header">
                <h1>yame.io</h1>
                <h2>{doc.docName}</h2>
            </div>
            <Nav />
            <ScrollPane />
            <div className="preview-only">Preview Only</div>
        </div>
    );
};
