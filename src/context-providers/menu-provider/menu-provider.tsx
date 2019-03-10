import React, { useState } from 'react';
import { Menu } from '../../components/toolbar';

export interface IMenuContextValue {
    activeMenu?: Menu;
    setActiveMenu: (menu?: Menu) => void;
    open: boolean;
}

export interface IMenuProviderProps {
    children?: React.ReactNode;
}

export const MenuContext = React.createContext<IMenuContextValue>({
    setActiveMenu: () => {},
    open: false
});

export const MenuProvider = (props: IMenuProviderProps) => {
    const { children } = props;
    const [activeMenu, setActiveMenu] = useState<Menu | undefined>(undefined);

    return (
        <MenuContext.Provider
            value={{
                activeMenu,
                setActiveMenu,
                open: activeMenu !== undefined
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};
