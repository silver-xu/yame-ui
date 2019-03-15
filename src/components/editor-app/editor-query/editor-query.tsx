import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { DialogProvider } from '../../../context-providers/dialog-provider';
import { EditorProvider } from '../../../context-providers/editor-provider';
import { MenuProvider } from '../../../context-providers/menu-provider';
import { DocRepo, IUser } from '../../../types';
import { Loading } from '../../loading';
import Editor from '../editor';

const API_URL = 'http://localhost:3001/graphql';

const DOC_REPO_QUERY = gql`
    {
        docRepo {
            docs {
                id
                docName
                content
                lastModified
            }
            publishedDocs {
                id
                docName
                content
                lastModified
            }
        }
        defaultDoc {
            namePrefix
            defaultContent
        }
    }
`;

export interface IEditorQueryProps {
    currentUser?: IUser;
}

export const EditorQuery = React.memo((props: IEditorQueryProps) => {
    const { currentUser } = props;

    const authLink = setContext((_, { headers }: { headers: any }) => {
        return {
            headers: {
                ...headers,
                authorization: currentUser ? currentUser.authToken : undefined
            }
        };
    });

    const client = new ApolloClient({
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
                    uri: API_URL
                })
            )
        ]),
        cache: new InMemoryCache()
    });

    return currentUser ? (
        <ApolloProvider client={client}>
            <Query
                query={DOC_REPO_QUERY}
                variables={{ authToken: currentUser.authToken }}
                fetchPolicy="network-only"
            >
                {({ loading, error, data }) => {
                    const docRepo =
                        data && data.docRepo
                            ? DocRepo.parseFromResponse(data.docRepo)
                            : undefined;

                    return docRepo ? (
                        <div className="App">
                            <EditorProvider
                                docRepo={docRepo}
                                defaultDoc={data.defaultDoc}
                            >
                                <DialogProvider>
                                    <MenuProvider>
                                        <Editor />
                                    </MenuProvider>
                                </DialogProvider>
                            </EditorProvider>
                        </div>
                    ) : (
                        <Loading text="Initializing Yame editor..." />
                    );
                }}
            </Query>
        </ApolloProvider>
    ) : (
        <Loading text="Authenticating User..." />
    );
});
