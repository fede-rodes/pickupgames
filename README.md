# pickupgames.net, Meteor React Redux FlowRouter ES6 web app
Web app for easily organize sport activities and connect players. Current version of the app is hosted here: https://pickupgamess.herokuapp.com

My previous pick-up games project (Meteor 1.2 + Blaze) can be found here: https://www.fulbacho.net

The aim of this project is to partially re-build fulbacho.net (adding improvements and lots of simplifications) while using a much modern stack, namely: Meteor 1.4 (almost 1.5), React, Redux, Flow router and CSS-Modules. Additionally, I would like to take the style to the extreme and for this reason I would propose to focus on mobile views only: max-width: 600px and centered (same view for all kind of devices).

## NEWS!!
I just started writing the spec for the pickupgames app (lots of work needs to be done yet), and decided to pause the code for a bit until the spec is fully defined. In that way, those who are interested in the project can start contributing with ideas and once we all agree with the features the app needs to have we can divide the project into milestones and start coding :)

Here is the link to the spec: https://docs.google.com/document/d/1uTo2BchpBs2C2lP0J_te-kxNxvuYsmPUpRXGcWDzV6s/edit?usp=sharing, don't hesitate to leave comments!

## Get started
1. cd to your meteor projects folder
2. git clone https://github.com/fede-rodes/pickupgames.git && cd pickupgames
3. install npm dependencies: meteor npm install
4. to run the project type: meteor --settings settings-dev.json

OBS: you won't be able to use the login system unless you register the app using your facebook developer account. You'll find the instructions on how to do it right here: https://guide.meteor.com/accounts.html#accounts-ui

After you register the app, add the credentials in the settings-dev.json file

## CSS
1. We are using basscss (http://basscss.com) utility library for atomic CSS, ant design (https://ant.design) for built in components and CSS-Modules (https://github.com/nathantreid/meteor-css-modules) to make our life easier :)

## Contribute :)
I'm looking for some help. If you like the project, don't hesitate to create and
issue to say 'hello', or contact me via twitter (@fede_rodes) or to my email: federodes@gmail.com.
