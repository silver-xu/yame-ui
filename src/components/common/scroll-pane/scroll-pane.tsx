import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab } from '@material-ui/core';
import classnames from 'classnames';
import throttle from 'lodash.throttle';
import React, { useContext, useEffect, useState } from 'react';
import { IContentNode } from '../../../types/doc';
import { isElementInViewport } from '../../../utils/dom';
import { Content } from '../content';
import { ViewContext } from '../view-provider/view-provider';

import './scroll-pane.scss';

library.add(faArrowUp);

export interface INodeDom {
    node: IContentNode;
    dom: Element;
}

const TOP_OFFSET = 60;
const SHOWUPBUTTON_THREASHOLD = 200;

export const ScrollPane = () => {
    const {
        doc,
        surpressScrollTracking,
        activeNode,
        setActiveNode
    } = useContext(ViewContext);

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

    const handleUpClick = () => {
        if (contentRef.current) {
            contentRef.current.scrollTo(0, 0);
        }
    };

    return (
        <div>
            <div
                className="content"
                ref={contentRef}
                onScroll={e => throttle(handleContentScroll, 100)(e)}
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
