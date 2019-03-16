import React, { useEffect, useState } from 'react';
import { Doc } from '../../../types';
import { IContentNode } from '../../../types/doc';
import { Content } from '../content';

import { Fab } from '@material-ui/core';
import classnames from 'classnames';
import { isElementInViewport } from '../../../utils/dom';
import './preview.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import throttle from 'lodash.throttle';

library.add(faArrowUp);

export interface IPreviewProps {
    doc: Doc;
}

export interface INodeDom {
    node: IContentNode;
    dom: Element;
}

const TOP_OFFSET = 60;
const SHOWUPBUTTON_THREASHOLD = 200;

export const Preview = (props: IPreviewProps) => {
    const { doc } = props;
    const nodeTree = doc.buildContentNodeTree();
    const nodeDoms: { [id: string]: INodeDom } = {};

    const traverseTree = (
        currentNode: IContentNode,
        action: (node: IContentNode) => void
    ) => {
        currentNode.nodes.forEach(node => {
            action(node);
            traverseTree(node, action);
        });
    };

    const getActiveNodeDom = (): INodeDom | undefined => {
        let minClientTopNodeDom: INodeDom | undefined;

        Object.entries(nodeDoms).map(([, nodeDom]: [string, INodeDom]) => {
            if (
                isElementInViewport(nodeDom.dom, TOP_OFFSET) &&
                (!minClientTopNodeDom ||
                    nodeDom.dom.scrollTop < minClientTopNodeDom.dom.scrollTop)
            ) {
                minClientTopNodeDom = nodeDom;
            }
        });

        return minClientTopNodeDom;
    };

    const [activeNode, setActiveNode] = useState<IContentNode | undefined>(
        undefined
    );

    const [surpressScrollTracking, setSurpressScrollTracking] = useState<
        boolean
    >(false);

    const [showScrollUp, setShowScrollUp] = useState<boolean>(false);

    const contentRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        traverseTree(nodeTree, (node: IContentNode) => {
            const element = document.querySelector(`#${node.id}`);

            if (element) {
                nodeDoms[node.id] = { dom: element, node };
            }
        });
        if (surpressScrollTracking) {
            return;
        }

        if (!activeNode) {
            const activeNodeDom = getActiveNodeDom();
            setActiveNode(activeNodeDom ? activeNodeDom.node : undefined);
        }
    }, [{}]);

    const handleContentScroll = (e: React.SyntheticEvent<HTMLElement>) => {
        if (surpressScrollTracking) {
            return;
        }

        const newActiveNodeDom = getActiveNodeDom();

        if (
            newActiveNodeDom &&
            activeNode &&
            newActiveNodeDom.node.id !== activeNode.id
        ) {
            setActiveNode(newActiveNodeDom.node);
        }

        if (e.currentTarget.scrollTop > SHOWUPBUTTON_THREASHOLD) {
            setShowScrollUp(true);
        } else {
            setShowScrollUp(false);
        }
    };

    const handleLinkClick = (
        e: React.MouseEvent<HTMLElement>,
        node: IContentNode
    ) => {
        e.stopPropagation();
        setSurpressScrollTracking(true);
        setActiveNode(node);
        setTimeout(() => {
            setSurpressScrollTracking(false);
        }, 1000);
    };

    const handleUpClick = () => {
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    };

    const renderTree = (treeNode: IContentNode) => {
        return (
            <ul>
                {treeNode.nodes.map(node => (
                    <li
                        onClick={(e: React.MouseEvent<HTMLElement>) =>
                            handleLinkClick(e, node)
                        }
                    >
                        <a
                            href={`#${node.id}`}
                            className={classnames({
                                active: activeNode && node.id === activeNode.id
                            })}
                        >
                            {node.text}
                        </a>
                        {renderTree(node)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <div className="header">
                This is a preview of [{doc.docName}], copy & paste the url would
                not work without your account.
            </div>
            <div className="nav">{renderTree(nodeTree)}</div> */}
            <div
                className="content"
                ref={contentRef}
                onScroll={() => throttle(handleContentScroll, 100)}
            >
                <Content doc={doc} />
            </div>
            <div className="floating-tools">
                <Fab
                    aria-label="Up"
                    onClick={handleUpClick}
                    className={classnames({ hide: !showScrollUp })}
                >
                    <FontAwesomeIcon icon="arrow-up" />
                </Fab>
            </div>
        </div>
    );
};
