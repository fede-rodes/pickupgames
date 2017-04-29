import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
// import { FlowRouter } from 'meteor/kadira:flow-router';
import { Icon, Popover } from 'antd';
import Constants from '../../../api/constants.js';
import styles from './styles.scss';

//------------------------------------------------------------------------------
// AUX FUNCTIONS:
//------------------------------------------------------------------------------
function linkToAnchor(handleClick) {
  return function (link) {
    const { text, key } = link;
    return (
      <a
        key={key}
        className="block my2"
        href="#"
        id={key}
        onClick={(e) => {
          e.preventDefault();
          handleClick(e);
        }}
      >
      {text}
      </a>
    );
  };
}
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
      mainMenuOpen: false,
      avatarMenuOpen: false,
    };
  }

  handleToggle(e) {
    e.preventDefault();
    const whatMenu = e.target.id;
    this.setState({ [`${whatMenu}MenuOpen}`]: !this.state[`${whatMenu}MenuOpen}`] });
  }

  handleLinkClick(e) {
    e.preventDefault();
    const key = e.target.id;
    this.setState({
      mainMenuOpen: false,
      avatarMenuOpen: false,
    });

    switch (key) {
      case 'logout':
        Meteor.logout();
        break;
      default:
        // FlowRouter.go(key);
        break;
    }
  }

  renderMainMenu() {
    // Popover content
    const links = [
      { icon: 'environment-o', text: 'Activities', key: 'feed' },
      { icon: 'plus', text: 'New Activity', key: 'new-marker' },
      { icon: 'plus', text: 'Discussion', key: 'comments' },
    ];

    return (
      <Popover
        placement="bottomRight"
        content={links.map(linkToAnchor(this.handleLinkClick))}
        trigger="click"
      >
        <Icon
          id="main"
          className="trigger h3 pointer"
          type={this.state.mainMenuOpen ? 'menu-unfold' : 'menu-fold'}
          onClick={this.handleToggle}
        />
      </Popover>
    );
  }

  renderAvatar(user) {
    // Popover content
    const links = [
      { icon: 'export', text: 'Log Out', key: 'logout' },
    ];

    return (
      <Popover
        placement="bottomRight"
        content={links.map(linkToAnchor(this.handleLinkClick))}
        trigger="click"
      >
        <img
          id="avatar"
          src={user.avatar}
          alt={user.profile.name}
          height="30"
          className="circle pointer"
          onClick={this.handleToggle}
        />
      </Popover>
    );
  }

  renderPlaceholder() {
    return <div style={{ height: 25, width: 25 }} />;
  }

  render() {
    const { meteorData } = this.props;
    const { loggedIn, curUser } = meteorData;

    return (
      <header className={styles.Header}>
        {this.renderMainMenu()}
        <a href="/feed">{Constants.DOMAIN_NAME}</a>
        {loggedIn ? this.renderAvatar(curUser) : this.renderPlaceholder()}
      </header>
    );
  }
}

Header.propTypes = {
  meteorData: PropTypes.shape({
    curUserId: PropTypes.string,
    curUser: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
    // curRoute: PropTypes.string.isRequired,
  }).isRequired,
};
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
}, Header);

export default HeaderContainer;
