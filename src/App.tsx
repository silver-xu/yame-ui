import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import './App.css';
import Editor from './components/editor';
import {
    saveAnonymousAuthToken,
    saveFacebookAuthToken
} from './services/auth-service';
import { DocRepo, IUser, UserType } from './types';

const API_URL = 'http://localhost:3001/graphql';

const refreshAuthToken = (currentUser: IUser) => {
    if (currentUser) {
        currentUser.userType === UserType.Facebook
            ? saveFacebookAuthToken(currentUser.authToken)
            : saveAnonymousAuthToken(currentUser.authToken);
    }
};

const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
};

class App extends Component {
    private client: ApolloClient<{}>;
    private DOC_REPO_QUERY = gql`
        {
            docRepo {
                docs {
                    id
                    docName
                    content
                    lastModified
                }
            }
            currentUser {
                userId
                userType
                authToken
                userName
            }
            defaultDoc {
                namePrefix
                defaultContent
            }
        }
    `;

    constructor(props: any) {
        super(props);

        this.client = new ApolloClient({
            headers: {
                Authorization: getAuthToken()
            }
        });
    }

    public render() {
        return (
            <ApolloProvider client={this.client}>
                <Query query={this.DOC_REPO_QUERY}>
                    {({ loading, error, data }) => {
                        const docRepo =
                            data && data.docRepo
                                ? DocRepo.parseFromResponse(data.docRepo)
                                : undefined;

                        if (data && data.currentUser) {
                            refreshAuthToken(data.currentUser);
                        }

                        return docRepo ? (
                            <div className="App">
                                <Editor
                                    docRepo={docRepo}
                                    currentUser={data.currentUser}
                                />
                            </div>
                        ) : (
                            <div>Initializing...</div>
                        );
                    }}
                </Query>
            </ApolloProvider>
        );
    }
}

export default App;
