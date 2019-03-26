import classnames from 'classnames';
import React, { ReactNode, useContext } from 'react';
import { MenuContext } from '../../../context-providers/menu-provider';
import './side-bar.scss';

export interface ISideBarProps {
    children?: ReactNode;
}

export const SideBar = (props: ISideBarProps) => {
    const { children } = props;

    const { open, inTransition, setActiveMenu } = useContext(MenuContext);

    return (
        <>
            <div
                className={classnames({
                    hide: !open && !inTransition,
                    'side-bar-overlay': true
                })}
                onClick={() => setActiveMenu(undefined)}
            />
            <div
                className={classnames({
                    hide: !open,
                    'side-bar': true
                })}
            >
                {children}
            </div>
            ;
        </>
    );
};
