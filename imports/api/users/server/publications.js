import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'underscore';

//------------------------------------------------------------------------------
Meteor.publish('Users.publications.curUser', function () {
  const curUserId = this.userId;

  if (curUserId) {
    const selector = {
      _id: curUserId,
    };
    const options = {
      fields: {
        services: false,
        emails: false,
      },
      limit: 1,
    };
    return Meteor.users.find(selector, options);
  }
  return this.ready();
});
//------------------------------------------------------------------------------
Meteor.publish('Users.publications.getNameAndAvatar', function (userIds) {
  check(userIds, [String]);

  if (userIds.length > 0) {
    const selector = {
      _id: {
        $in: userIds,
      },
    };
    const options = {
      fields: {
        profile: true,
        username: true,
      },
    };
    return Meteor.users.find(selector, options);
  }
  return this.ready();
});
//------------------------------------------------------------------------------
