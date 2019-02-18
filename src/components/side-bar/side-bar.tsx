import React, { ReactNode } from 'react';
import './side-bar.scss';

export interface ISideBarProps {
    isOpen: boolean;
    children?: ReactNode;
}
export const SideBar = (props: ISideBarProps) => {
    const { isOpen, children } = props;
    return isOpen ? <div className="side-bar">{children}</div> : null;
};
