import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { Doc, IUser } from '../../../types';
import { Loading } from '../../loading';
import { Preview } from '../preview';

const API_URL = 'http://localhost:3001/graphql';

const DOC_QUERY = gql`
    query Doc($docId: String!) {
        doc(docId: $docId) {
            id
            docName
            content
            lastModified
        }
    }
`;

export interface IPreviewQueryProps {
    currentUser?: IUser;
    docId: string;
}

export const PreviewQuery = React.memo((props: IPreviewQueryProps) => {
    const { currentUser, docId } = props;

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
                query={DOC_QUERY}
                variables={{ authToken: currentUser.authToken, docId }}
                fetchPolicy="network-only"
            >
                {({ loading, error, data }) => {
                    return !loading && !error && data.doc ? (
                        <div className="App">
                            <Preview doc={Doc.parseFromResponse(data)} />
                        </div>
                    ) : (
                        <Loading text="Initializing Yame Previewer..." />
                    );
                }}
            </Query>
        </ApolloProvider>
    ) : (
        <Loading text="Authenticating User..." />
    );
});
