import React from 'react';
import { Meteor } from 'meteor/meteor';
import FacebookProvider, { Comments } from 'react-facebook';
import DefaultLayout from '../layouts/default/default-layout.jsx';

const CommentsPage = () => (
  <DefaultLayout width="600px" padding="20px 15px 0" center>
    <h1 className="center">Leave a comment!</h1>
    <FacebookProvider appID={Meteor.settings.public.facebook.appId}>
      <Comments href="http://localhost:6546" />
    </FacebookProvider>
  </DefaultLayout>
);

export default CommentsPage;
