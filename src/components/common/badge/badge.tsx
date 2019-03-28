import React from 'react';
import './badge.scss';

export interface IBadgetProps {
    count: number;
}

export const Badge = (props: IBadgetProps) => {
    const badgeLabel = props.count > 99 ? '99+' : props.count.toString();
    return <span className="badge">{badgeLabel}</span>;
};
