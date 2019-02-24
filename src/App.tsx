import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import './App.css';
import Editor from './components/editor';
import { DocRepo } from './types';

const API_URL = 'http://localhost:3001/graphql';

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
            uri: API_URL
        });
    }

    public render() {
        return (
            <ApolloProvider client={this.client}>
                <Query query={this.DOC_REPO_QUERY}>
                    {({ loading, error, data }) => {
                        const docRepo = data.docRepo
                            ? DocRepo.parseFromResponse(data.docRepo)
                            : undefined;

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
