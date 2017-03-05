import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import _ from 'underscore';
import AuxFunctions from '../aux-functions.js';
import PostsSystem from './namespace.js';
import './api.js'; // PostsSystem.api
import './collection.js'; // PostsSystem.collection
import { Users } from '../users/namespace.js';
import '../users/api.js'; // Users.api

//------------------------------------------------------------------------------
Meteor.methods({ 'PostsSystem.methods.createPost'(newPost) {
  // Check arguments
  try {
    check(newPost, {
      postedOn: String,
      content: String,
    });
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at PostsSystem.methods.createPost');
  }

  const errors = PostsSystem.api.checkNewPostFields(newPost);
  if (AuxFunctions.hasErrors(errors)) {
    throw new Meteor.Error(400, AuxFunctions.getFirstError(errors).value);
  }

  // Extend doc by adding createdBy and createdAt fields
  _.extend(newPost, {
    createdBy: curUserId,
    createdAt: new Date(),
  });

  // Insert document into DB
  PostsSystem.collection.insert(newPost);
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'PostsSystem.methods.editPost'(editedPost) {
  // Check arguments
  try {
    check(editedPost, {
      editPostId: String,
      editPostContent: String,
    });
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at PostsSystem.methods.editPost');
  }

  const errors = PostsSystem.api.checkEditPostFields(editedPost);
  if (AuxFunctions.hasErrors(errors)) {
    throw new Meteor.Error(400, AuxFunctions.getFirstError(errors).value);
  }

  const { editPostId, editPostContent } = editedPost;

  // Check that current user is the author of the post
  const post = PostsSystem.collection.findOne({ _id: editPostId });

  if (post.createdBy !== curUserId) {
    throw new Error(`User non authorized at PostsSystem.methods.editPost. userId: ${curUserId}`);
  }

  // Update document in DB
  PostsSystem.collection.update({ _id: editPostId }, { $set: { content: editPostContent } });
} });
//------------------------------------------------------------------------------
Meteor.methods({ 'PostsSystem.methods.deletePost'(postId) {
  // Check arguments
  try {
    check(postId, String);
  } catch (exc) {
    throw new Meteor.Error(exc.sanitizedError.error, exc.message);
  }

  const curUserId = this.userId;

  // Is the current user logged in?
  if (!curUserId) {
    throw new Error('user is not logged in at PostsSystem.methods.deletePost');
  }

  // Check that current user is the author of the post
  const post = PostsSystem.collection.findOne({ _id: postId });

  if (post.createdBy !== curUserId) {
    throw new Error(`User non authorized at PostsSystem.methods.deletePost. userId: ${curUserId}`);
  }

  // Remove document from DB
  PostsSystem.collection.remove({ _id: postId });
} });
//------------------------------------------------------------------------------
