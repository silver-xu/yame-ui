import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Badge } from '../../common/badge';

export interface IBarItemProps {
    caption: string;
    icon: IconProp;
    badgeCount?: number;
}

export const BarItem = (props: IBarItemProps) => {
    const { caption, icon, badgeCount } = props;
    return (
        <li>
            <FontAwesomeIcon icon={icon} className="icon" />
            <label className="menu-label">{caption}</label>
            <span className="count">
                {badgeCount && badgeCount > 0 ? (
                    <Badge count={badgeCount} />
                ) : null}
            </span>
        </li>
    );
};
