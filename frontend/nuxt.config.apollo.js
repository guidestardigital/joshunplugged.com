import { onError } from '@apollo/client/link/error'

export default ({ $config }) => {
  const link = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(`[GraphQL error]: Message: ${message}`);
        console.error(`[GraphQL error]: Locations: ${JSON.stringify(locations)}`);
        console.error(`[GraphQL error]: Path: ${path}`);
      });
    }

    if (networkError) console.error(`[Network error]: ${networkError}`)
  })

  return {
    link,
    httpEndpoint: $config.apiDomain ? $config.apiDomain + '/graphql' : "http://localhost:1337/graphql",
    httpLinkOptions: {
      credentials: 'same-origin'
    }
  }
}