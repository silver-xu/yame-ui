import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React from 'react';
import './side-bar-items.scss';

export interface ICommandButtonProps {
    description: string;
    heading: string;
    icon: IconProp;
    onClick?: () => void;
    disabled?: boolean;
}

export const CommandButton = (props: ICommandButtonProps) => {
    const { description, heading, icon, onClick, disabled } = props;

    const handleClick = () => {
        if (!disabled) {
            if (onClick) {
                onClick();
            }
        }
    };

    return (
        <>
            <div
                className={classnames({
                    container: true,
                    command: true,
                    disabled
                })}
                onClick={handleClick}
            >
                <h3>{description}</h3>
                <div className="primary">
                    <FontAwesomeIcon icon={icon} />
                    {heading}
                </div>
            </div>
        </>
    );
};
