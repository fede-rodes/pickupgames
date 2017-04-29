import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

/*
 * We use `gql` from graphql-tag to parse GraphQL query strings into the standard GraphQL AST
 * See for more information: https://github.com/apollographql/graphql-tag
 */
const UPDATE_CUR_USER_SETTINGS = gql`
  mutation updateCurUserSettings($location: String!) { # definition / schema
    updateCurUserSettings(location: $location) { # call
      # curUser { # result
        _id
        name
        location
        emails {
          address
          verified
        }
        randomString
      #}
    }
  }
`;

// Create enhancer function
const updateCurUserSettingsMutation = graphql(UPDATE_CUR_USER_SETTINGS, {
  name: 'updateCurUserSettingsMutation',
});

export default updateCurUserSettingsMutation;
