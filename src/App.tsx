import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { EditorApp } from './components/editor-app';
import { PreviewApp } from './components/preview-app';
import { ViewerApp } from './components/viewer-app';

const App = () => {
    return (
        <BrowserRouter>
            <>
                <Switch>
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
                </Switch>
            </>
        </BrowserRouter>
    );
};

export default App;
