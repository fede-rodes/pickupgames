import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

/*
 * We use `gql` from graphql-tag to parse GraphQL query strings into the standard GraphQL AST
 * See for more information: https://github.com/apollographql/graphql-tag
 */
const ATTACH_ACTIVITY_TO_USER = gql`
  mutation Users_mutations_attachActivityToUser($activityId: ID!, $actionType: ACTION_TYPES!) {
    Users_mutations_attachActivityToUser(activityId: $activityId, actionType: $actionType) {
      _id
      name
      location
      #emails
      createdMarkers
      joinedMarkers
      randomString
    }
  }
`;

// Create enhancer function
const Users_mutations_attachActivityToUser = graphql(ATTACH_ACTIVITY_TO_USER, {
  name: 'Users_mutations_attachActivityToUser',
});

export default Users_mutations_attachActivityToUser;
