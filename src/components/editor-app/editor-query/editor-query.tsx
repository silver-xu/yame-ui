import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { DialogProvider } from '../../../context-providers/dialog-provider';
import { EditorProvider } from '../../../context-providers/editor-provider';
import { NavProvider } from '../../../context-providers/nav-provider';
import { DocRepo, IUser } from '../../../types';
import { Loading } from '../../loading';
import { Editor } from '../editor';

const API_URL = process.env.REACT_APP_EXP_API_URL || '';

const EDITOR_QUERY = gql`
    {
        docRepo {
            docs {
                id
                docName
                content
                lastModified
                published
                removed
                generatePDF
                generateWord
                protectDoc
                secretPhrase
                protectWholdDoc
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
            <ApolloHooksProvider client={client}>
                <Query
                    query={EDITOR_QUERY}
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
                                        <NavProvider>
                                            <Editor />
                                        </NavProvider>
                                    </DialogProvider>
                                </EditorProvider>
                            </div>
                        ) : (
                            <Loading text="Initializing Yame editor..." />
                        );
                    }}
                </Query>
            </ApolloHooksProvider>
        </ApolloProvider>
    ) : (
        <Loading text="Authenticating User..." />
    );
});
