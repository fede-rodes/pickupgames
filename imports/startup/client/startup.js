import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { $ } from 'meteor/jquery';
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

  // Facebool SDK
  Meteor.startup(() => {
    $('body').prepend('<div id="fb-root"></div>');
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.8&appId=${Meteor.settings.public.facebook.appId}`;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
});
