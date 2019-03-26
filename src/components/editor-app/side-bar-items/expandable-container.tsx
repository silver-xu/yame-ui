import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React, { useState } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './side-bar-items.scss';

library.add(faChevronRight);

export interface IExpandableContainer {
    description: string;
    heading: string;
    icon: IconProp;
    children: React.ReactNode;
    expanded: boolean;
}

export const ExpandableContainer = (props: IExpandableContainer) => {
    const {
        description,
        heading,
        icon,
        children,
        expanded: initiallyExpanded
    } = props;
    const [expanded, setExpanded] = useState<boolean>(initiallyExpanded);

    return (
        <>
            <div
                className="container expandable"
                onClick={() => setExpanded(!expanded)}
            >
                <h3>{description}</h3>
                <div className="primary">
                    <FontAwesomeIcon icon={icon} />
                    {heading}
                </div>
                <FontAwesomeIcon
                    className={classnames({
                        chev: true,
                        down: expanded
                    })}
                    icon="chevron-right"
                />
            </div>
            <div
                className={classnames({
                    hide: !expanded,
                    'container-content': true
                })}
            >
                {children}
            </div>
        </>
    );
};

ExpandableContainer.defaultProps = {
    expanded: false
};
