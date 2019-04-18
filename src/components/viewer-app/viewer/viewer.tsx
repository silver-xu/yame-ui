import React, { useContext } from 'react';
import { IContentNode } from '../../../types/doc';
import { Nav } from '../../common/nav';
import { ScrollPane } from '../../common/scroll-pane';
import { ViewContext } from '../../common/view-provider/view-provider';

import './viewer.scss';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const BLOB_BASE_URL = process.env.REACT_APP_BLOB_BASE_URL || '';

export interface INodeDom {
    node: IContentNode;
    dom: Element;
}

export const Viewer = () => {
    const { userId, doc } = useContext(ViewContext);
    return (
        <div className="viewer">
            <div className="header">
                <h1>Yame.io</h1>
                <h2>{doc.docName}</h2>

                <ul className="toolbar">
                    {(doc.generatePdf || doc.generateWord) && (
                        <li>Download as</li>
                    )}
                    {doc.generatePdf && (
                        <li>
                            <a
                                href={`${BLOB_BASE_URL}/download/pdf/${userId}/${
                                    doc.id
                                }`}
                                target="_blank"
                            >
                                PDF
                            </a>
                        </li>
                    )}
                    {doc.generateWord && (
                        <li>
                            <a
                                href={`${BLOB_BASE_URL}/download/word/${userId}/${
                                    doc.id
                                }`}
                                target="_blank"
                            >
                                Word
                            </a>
                        </li>
                    )}
                </ul>
            </div>
            <Nav />
            <ScrollPane />
        </div>
    );
};
