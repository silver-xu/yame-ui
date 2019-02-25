import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createHttpLink, HttpLink } from 'apollo-link-http';
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

        const authLink = setContext((_, { headers }) => {
            const token = getAuthToken();
            return {
                headers: {
                    ...headers,
                    authorization: token
                }
            };
        });

        this.client = new ApolloClient({
            link: ApolloLink.from([
                onError(({ graphQLErrors, networkError }) => {
                    if (graphQLErrors) {
                        graphQLErrors.map(({ message, locations, path }) =>
                            console.log(
                                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                            )
                        );
                    }
                    if (networkError) {
                        console.log(`[Network error]: ${networkError}`);
                    }
                }),
                authLink.concat(
                    new HttpLink({
                        uri: API_URL,
                        credentials: 'cors'
                    })
                )
            ]),
            cache: new InMemoryCache()
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
