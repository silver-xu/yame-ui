import React, { ReactNode } from 'react';
import './side-bar.scss';

export interface ISideBarProps {
    isOpen: boolean;
    children?: ReactNode;
}
export const SideBar = (props: ISideBarProps) => {
    const { isOpen, children } = props;
    return isOpen ? (
        <React.Fragment>
            <div className="side-bar-overlay" />
            <div className="side-bar">{children}</div>;
        </React.Fragment>
    ) : null;
};
