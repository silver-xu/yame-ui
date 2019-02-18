import React, { ReactChildren } from 'react';
import './side-bar.scss';

export interface ISideBarProps {
    isOpen: boolean;
    children?: ReactChildren;
}
export const SideBar = (props: ISideBarProps) => {
    const { isOpen, children } = props;
    return isOpen ? <div className="side-bar">{children}</div> : null;
};
