import classnames from 'classnames';
import React, { ReactNode } from 'react';
import { MenuContext } from '../../context-providers/menu-provider';
import './side-bar.scss';

export interface ISideBarProps {
    children?: ReactNode;
}

export const SideBar = (props: ISideBarProps) => {
    const { children } = props;
    return (
        <MenuContext.Consumer>
            {({ open, setActiveMenu }) => (
                <div
                    className={classnames({
                        hide: !open
                    })}
                >
                    <div
                        className="side-bar-overlay"
                        onClick={() => setActiveMenu(undefined)}
                    />
                    <div className="side-bar">{children}</div>;
                </div>
            )}
        </MenuContext.Consumer>
    );
};
