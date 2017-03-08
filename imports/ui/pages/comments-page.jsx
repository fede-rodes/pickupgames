import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
// import FacebookProvider, { Comments } from 'react-facebook';
import DefaultLayout from '../layouts/default/default-layout.jsx';

class CommentsPage extends Component {

  componentDidMount() {
    this.loadFB();
    // setInterval(this.loadFB, 60000);
  }

  loadFB() {
    // Load FB comments widget
    try {
      FB.XFBML.parse();
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <DefaultLayout width="600px" padding="20px 15px 0">
        <h1 className="center">Leave a comment!</h1>
        <div
          className="fb-comments"
          data-href="pickupgamess.herokuapp.com/comments"
          data-mobile="true"
          data-order-by="reverse_time"
          data-numposts="10"
        >
        </div>
        {/* <div
          className="fb-comments"
          data-href={Meteor.settings.public.facebook.commentsUrl}
          data-numposts="10"
        /> */}
      </DefaultLayout>
    );
  }
}

export default CommentsPage;


/*
import React from 'react';
import { Meteor } from 'meteor/meteor';
import FacebookProvider, { Comments } from 'react-facebook';
import DefaultLayout from '../layouts/default/default-layout.jsx';

const CommentsPage = () => (
  <DefaultLayout width="600px" padding="20px 15px 0" center>
    <h1 className="center">Leave a comment!</h1>
    <FacebookProvider appID={Meteor.settings.public.facebook.appId}>
      <Comments href={Meteor.settings.public.facebook.commentsUrl} />
    </FacebookProvider>
  </DefaultLayout>
);

export default CommentsPage;
*/
