import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { Doc } from '../../../types';
import { ViewProvider } from '../../common/view-provider/view-provider';
import { Viewer } from '../viewer/Viewer';

const API_URL = process.env.REACT_APP_EXP_API_URL || '';

const DOC_QUERY = gql`
    query DocByPermalink($username: String!, $permalink: String!) {
        docByPermalink(username: $username, permalink: $permalink) {
            id
            docName
            content
            lastModified
        }
    }
`;

export interface IViewQueryProps {
    username: string;
    permalink: string;
}

export const ViewerQuery = React.memo((props: IViewQueryProps) => {
    const { username, permalink } = props;

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
            new HttpLink({
                uri: API_URL
            })
        ]),
        cache: new InMemoryCache()
    });

    return (
        <ApolloProvider client={client}>
            <Query
                query={DOC_QUERY}
                variables={{ username, permalink }}
                fetchPolicy="network-only"
            >
                {({ loading, error, data }) => {
                    return !loading && !error && data.docByPermalink ? (
                        <div className="App">
                            <ViewProvider
                                doc={Doc.parseFromResponse(data.docByPermalink)}
                            >
                                <Viewer />
                            </ViewProvider>
                        </div>
                    ) : null;
                }}
            </Query>
        </ApolloProvider>
    );
});
