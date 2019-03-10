import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './side-bar-items.scss';

export interface ICommandButtonProps {
    description: string;
    heading: string;
    icon: IconProp;
    onClick?: () => void;
}

export const CommandButton = (props: ICommandButtonProps) => {
    const { description, heading, icon, onClick } = props;

    return (
        <React.Fragment>
            <div className="container command" onClick={onClick}>
                <h3>{description}</h3>
                <div className="primary">
                    <FontAwesomeIcon icon={icon} />
                    {heading}
                </div>
            </div>
        </React.Fragment>
    );
};
