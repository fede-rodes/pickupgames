import { Meteor } from 'meteor/meteor';
import moment from 'moment';
// import '../../../node_modules/basscss/css/basscss.css';
// import '../../../node_modules/@blueprintjs/core/dist/blueprint.css';
// import '../../../node_modules/@blueprintjs/datetime/dist/blueprint-datetime.css';
// import '../../../node_modules/wingcss/dist/wing.css';
// import '../../../node_modules/antd/dist/antd.css';
// import injectTapEventPlugin from 'react-tap-event-plugin';

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

  // Needed for onTouchTap (material-ui)
  // http://stackoverflow.com/a/34015469/988941
  // injectTapEventPlugin();
});
