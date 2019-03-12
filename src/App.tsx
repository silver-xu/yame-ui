import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { EditorApp } from './components/editor-app';
import { ViewerApp } from './components/viewer-app';
import { PreviewApp } from './components/preview-app';

const App = () => {
    return (
        <BrowserRouter>
            <React.Fragment>
                <Route exact={true} path="/editor" component={EditorApp} />
                <Route
                    exact={true}
                    path="/preview/:docId"
                    component={PreviewApp}
                />
                <Route
                    exact={true}
                    path="/:username/:permalink"
                    component={ViewerApp}
                />
            </React.Fragment>
        </BrowserRouter>
    );
};

export default App;
