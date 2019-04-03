import React, { useContext, useState } from 'react';
import { MenuItem } from '../../components/editor-app/app-bar';
import { EditorContext, EditorMode } from '../editor-provider';

export interface INavContextValue {
    activeMenu: MenuItem | undefined;
    setActiveMenu: (menuItem?: MenuItem) => void;
}

export interface INavProviderProps {
    children?: React.ReactNode;
}

export const NavContext = React.createContext<INavContextValue>({
    activeMenu: MenuItem.CurrentDoc,
    setActiveMenu: () => {}
});

export const NavProvider = React.memo((props: INavProviderProps) => {
    const [activeMenu, setActiveMenu] = useState<MenuItem | undefined>(
        MenuItem.AvailableDocs
    );

    const { setEditorMode } = useContext(EditorContext);

    const handleSetActiveMenu = (menuItem?: MenuItem) => {
        setActiveMenu(menuItem);
        switch (menuItem) {
            case MenuItem.AvailableDocs:
                setEditorMode(EditorMode.AvailableDocs);
                break;
            case MenuItem.CurrentDoc:
                setEditorMode(EditorMode.CurrentDoc);
                break;
            case MenuItem.Drafts:
                setEditorMode(EditorMode.Drafts);
                break;
            case MenuItem.Published:
                setEditorMode(EditorMode.Published);
                break;
            case MenuItem.Trash:
                setEditorMode(EditorMode.Trash);
                break;
        }
    };

    return (
        <NavContext.Provider
            value={{
                activeMenu,
                setActiveMenu: handleSetActiveMenu
            }}
        >
            {props.children}
        </NavContext.Provider>
    );
});
