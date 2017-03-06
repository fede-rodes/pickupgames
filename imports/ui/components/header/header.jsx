import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Icon, Popover } from 'antd';
import Constants from '../../../api/constants.js';
import Actions from '../../../api/redux/client/actions.js';
import styles from './styles.scss';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class Header extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.state = {
      menuOpen: false,
    };
  }

  handleToggle(e) {
    e.preventDefault();
    const prevState = this.state.menuOpen;
    this.setState({ menuOpen: !prevState });
  }

  handleLinkClick(e) {
    e.preventDefault();
    const { reduxActions } = this.props;

    const key = e.target.id;
    this.setState({ menuOpen: false });

    switch (key) {
      case 'logout':
        Meteor.logout();
        break;
      case 'login':
        reduxActions.dispatchSetBooleanField('isOpen', true);
        break;
      default:
        FlowRouter.go(key);
        break;
    }
  }

  renderAvatar(user) {
    return (
      <img
        src={user.avatar}
        alt={user.profile.name}
        height="30"
        className="circle"
      />
    );
  }

  renderPlaceholder() {
    return <div style={{ height: 25, width: 25 }} />;
  }

  render() {
    const { meteorData } = this.props;
    const { loggedIn, curUser } = meteorData;

    // Popover content
    const links = [
      // Public links
      { icon: 'environment-o', text: 'Activities', key: 'feed' },
      { icon: 'plus', text: 'New Activity', key: 'new-marker' },
      { icon: 'plus', text: 'Discussion', key: 'comments' },
      // Auth links
      { icon: 'export', text: 'Logout', key: 'logout', state: 'loggedIn' },
      { icon: 'select', text: 'Login', key: 'login', state: 'loggedOut' },
    ];

    const popoverContent = links.map(({ text, key, state }) => {
      if (!state || (loggedIn && state === 'loggedIn') || (!loggedIn && state === 'loggedOut')) {
        return (
          <a
            key={key}
            href="#"
            id={key}
            onClick={this.handleLinkClick}
            className="block"
          >
          {text}
          </a>
        );
      }
      return null;
    });

    return (
      <header className={styles.Header}>
        <Popover placement="bottomRight" content={popoverContent} trigger="click">
          <Icon
            className="trigger h3 pointer"
            type={this.state.menuOpen ? 'menu-unfold' : 'menu-fold'}
            onClick={this.handleToggle}
          />
        </Popover>
        <a href="/feed">{Constants.DOMAIN_NAME}</a>
        {loggedIn ? this.renderAvatar(curUser) : this.renderPlaceholder()}
      </header>
    );
  }
}

Header.propTypes = {
  reduxActions: PropTypes.object.isRequired,
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    curUser: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    // curRoute: PropTypes.string.isRequired,
  }).isRequired,
};
//------------------------------------------------------------------------------
// REDUX INTEGRATION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle UI State (Redux)
* integration.
*/
const namespace = 'login';

function mapStateToProps(state) {
  return { reduxState: state[namespace] };
}

function mapDispatchToProps(dispatch) {
  // Bind actions to current Page. TODO: use functional programming
  // (redux helper?) for binding namespace to actions.
  const reduxActions = {
    dispatchSetBooleanField(fieldName, value) {
      return dispatch(Actions.setBooleanField(namespace, fieldName, value));
    },
    dispatchSetErrors(errorsObj) {
      return dispatch(Actions.setErrors(namespace, errorsObj));
    },
    dispatchClearErrors(fieldName) {
      return dispatch(Actions.clearErrors(namespace, fieldName));
    },
  };

  return { reduxActions };
}
//------------------------------------------------------------------------------
// PAGE CONTAINER DEFINITION:
//------------------------------------------------------------------------------
/**
* @summary Wrapper around the 'Page' component to handle Domain State Meteor
* reactivity (component-level subscriptions etc etc), and pass data down to
* 'Page' component.
*/
const HeaderContainer = createContainer(() => {
  const curUser = Meteor.user();
  // const curRoute = FlowRouter.current().route.name;

  return {
    meteorData: {
      curUserId: Meteor.userId(),
      curUser,
      loggedIn: !!curUser,
      // curRoute,
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(Header));

export default HeaderContainer;
