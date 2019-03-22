import classnames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
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

    const nodeTree = doc.buildContentNodeTree();

    useEffect(() => {
        setActiveNode(activeNode);
    }, [activeNode && activeNode.id]);

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

    return <div className="nav">{renderTree(nodeTree)}</div>;
};
