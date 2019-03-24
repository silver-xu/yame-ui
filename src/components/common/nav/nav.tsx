import classnames from 'classnames';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Doc } from '../../../types';
import { IContentNode } from '../../../types/doc';
import { ViewContext } from '../view-provider/view-provider';
import './nav.scss';

export const Nav = () => {
    const {
        doc,
        activeNode,
        setActiveNode,
        setSurpressScrollTracking
    } = useContext(ViewContext);

    const [renderedTree, setRenderedTree] = useState<ReactNode | null>(null);

    useEffect(() => {
        setActiveNode(activeNode);
    }, [activeNode && activeNode.id]);

    useEffect(() => {
        recursivelyRenderTree();
    }, []);

    const recursivelyRenderTree = async () => {
        const nodeTree = await doc.buildContentNodeTree();
        const tree = renderTree(nodeTree);
        setRenderedTree(tree);
    };

    const handleLinkClick = (
        e: React.MouseEvent<HTMLElement>,
        node: IContentNode
    ) => {
        e.stopPropagation();
        setActiveNode(node);
        setSurpressScrollTracking(true);
        setTimeout(() => {
            setSurpressScrollTracking(false);
        }, 1000);
    };

    const renderTree = (treeNode: IContentNode) => (
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

    return <div className="nav">{renderedTree}</div>;
};
