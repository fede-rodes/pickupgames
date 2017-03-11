# pickupgames.net, Meteor React Redux FlowRouter ES6 web app
Web app for easily organize sport activities and connect players. Current version of the app is hosted here: https://pickupgamess.herokuapp.com

My previous pick-up games project (Meteor 1.2 + Blaze) can be found here: https://www.fulbacho.net

The aim of this project is to re-build fulbacho.net using a much modern stack (Meteor, React, Redux, Flow router, CSS-Modules) and, of course, to add improvements / simplifications to the project in comparison with fulbacho.net. I consider that one of the biggest mistakes when building fulbacho.net was to build views for all kind of devices (mobile, tablet and desktop). This was too much time consuming and, for this reason, I would like to focus now only on mobile view (max-width: 600, centered).

## 1st Milestone
- login / signup using facebook account (I think this is the simplest approach).
- after signup display setup page were the user indicates city where she lives and at least one sport. (In the future, based on user interaction we can infer more info about the user: more sports, more accurate location of the user within a city, user's gender, ...)
- after setup page is done, the user should be redirect to the feed page (will contain 2 views: list -default- and map) where the list of activities associated to the user's preferences (city + selected sports) is be displayed. Alternatively, the user can see the location of all the activities on a map by clicking the map button at the bottom of the feed (list) view.
- If one of the activities in the list is clicked, the user will be re-directed to the activity page where all the data about that particular activity is displayed (location, time, etc), as well as the list of participants and a simple post system to allow communication among the users.
- The activity page should provide a link to the admin dashboard to allow changing any data in the game (location, date, time, ...)


## Clone repo
1. cd to your meteor projects folder
2. git clone https://github.com/fede-rodes/pickupgames.git && cd pickupgames

## Install dependencies
1. meteor npm install
2. setup ESlint with your IDE, see https://guide.meteor.com/code-style.html

## CSS
1. We are using basscss (http://basscss.com) utility library for atomic CSS, ant design (https://ant.design) for built in components and CSS-Modules (https://github.com/nathantreid/meteor-css-modules) to make our life easier :)

## Contribute :)
I'm looking for some help. If you like the project, don't hesitate to create and
issue to say 'hello', or contact me via twitter (@fede_rodes).
