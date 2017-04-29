import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

/*
 * We use `gql` from graphql-tag to parse GraphQL query strings into the standard GraphQL AST
 * See for more information: https://github.com/apollographql/graphql-tag
 */
const CREATE_ACTIVITY = gql`
  mutation createActivity($sport: String!, $venueId: ID!, $date: String!, $time: String!) {
    createActivity(sport: $sport, venueId: $venueId, date: $date, time: $time) {
    	_id
    	sport
    	venueId
    	date
    	time
    	createdBy
    	createdAt
    	title
    	followers
    	participants
    	status
    	repeat
    	admins
      randomString
    }
  }
`;

// Create enhancer function
const createActivityMutation = graphql(CREATE_ACTIVITY, {
  name: 'createActivityMutation',
});

export default createActivityMutation;
