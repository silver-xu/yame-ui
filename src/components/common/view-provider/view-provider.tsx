import React, { ReactNode, useState } from 'react';
import { Doc } from '../../../types';
import { IContentNode } from '../../../types/doc';

export interface IViewProviderProps {
    children?: ReactNode;
    doc: Doc;
}

export interface IViewContextValue {
    doc: Doc;
    activeNode?: IContentNode;
    setActiveNode: (node?: IContentNode) => void;
    surpressScrollTracking: boolean;
    setSurpressScrollTracking: (surpress: boolean) => void;
}

export const ViewContext = React.createContext<IViewContextValue>({
    doc: new Doc('foo', 'bar', 'foobar', new Date(), false, true, true, false),
    activeNode: undefined,
    setActiveNode: (node?: IContentNode) => {},
    surpressScrollTracking: false,
    setSurpressScrollTracking: (surpress: boolean) => {}
});

export const ViewProvider = React.memo((props: IViewProviderProps) => {
    const { children, doc } = props;

    const [activeNode, setActiveNode] = useState<IContentNode | undefined>(
        undefined
    );

    const [surpressScrollTracking, setSurpressScrollTracking] = useState<
        boolean
    >(false);

    return (
        <ViewContext.Provider
            value={{
                doc,
                activeNode,
                setActiveNode,
                surpressScrollTracking,
                setSurpressScrollTracking
            }}
        >
            {children}
        </ViewContext.Provider>
    );
});
