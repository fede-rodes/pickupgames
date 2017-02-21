import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'underscore';
// import { Counts } from 'meteor/tmeasday:publish-counts';
import PostsSystem from '../namespace.js';
import '../collection.js'; // PostsSystem.collection

//------------------------------------------------------------------------------
Meteor.publishComposite('PostsSystem.publications.getPosts', function (postedOn) {
  check(postedOn, String);

  const options = {
    fields: {
      profile: true,
    },
    limit: 1,
  };

  return {
    find() {
      // Must return a cursor containing top level documents
      return PostsSystem.collection.find({ postedOn });
    },
    children: [{
      find(post) {
        // Called for each top level document. Top level document is passed
        // in as an argument.
        // Must return a cursor of second tier documents.
        return Meteor.users.find({ _id: post.createdBy }, options);
      },
    }],
  };
});
//------------------------------------------------------------------------------
