import { Meteor } from 'meteor/meteor';
import moment from 'moment';
// import '../../../node_modules/basscss/css/basscss.css';

Meteor.startup(() => {
  console.log('[client] startup');

  // Set default language
  moment.locale('en');
  // Get user country
  /* Meteor.call('Users.methods.getCurUserLocation', (err, { country, location }) => {
    if (err) {
      console.log(err);
    } else {
			console.log('[client startup] geo location set');
      LocalState.set('globals.userLocation', {
        country: country.name,
        coordinates: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
    }
  }); */
});
