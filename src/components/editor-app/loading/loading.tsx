import React from 'react';
import './loading.scss';

export interface ILoadingProps {
    text: string;
}

export const Loading = (props: ILoadingProps) => {
    const { text } = props;
    return (
        <div className="bg">
            <div className="spinner">
                <div className="bounce1" />
                <div className="bounce2" />
                <div className="bounce3" />
                <h2>{text}</h2>
            </div>
        </div>
    );
};
