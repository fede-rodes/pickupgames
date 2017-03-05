import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Icon, Popover } from 'antd';
import Actions from '../../api/redux/client/actions.js';
// import HeaderContainer from '../components/header/header.jsx';
import ForceLoginContainer from '../components/force-login/force-login.jsx';
// import Footer from '../components/footer';
import styles from './styles.scss';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class DefaultLayout extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.state = { collapsed: false };
  }

  handleToggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  handleMenuClick(e) {
    e.preventDefault();
    const { reduxActions } = this.props;

    const key = e.target.id;
    this.setState({ collapsed: true });

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

  render() {
    const {
      children,
      forceLogin,
      withHeader,
      withFooter,
      width,
      padding,
      meteorData,
    } = this.props;

    const { curUser, loggedIn } = meteorData;

    // Popover content
    const links = [
      // Public links
      { icon: 'environment-o', text: 'Activities', key: 'feed' },
      { icon: 'plus', text: 'New Activity', key: 'new-marker' },
      // Auth links
      { icon: 'export', text: 'Logout', key: 'logout', state: 'loggedIn' },
      { icon: 'select', text: 'Login', key: 'login', state: 'loggedOut' },
    ];

    const rows = links.map(({ icon, text, key, state }) => {
      if (!state || (loggedIn && state === 'loggedIn') || (!loggedIn && state === 'loggedOut')) {
        return (
          <p key={key}><a href="" id={key} onClick={this.handleMenuClick}>{text}</a></p>
        );
      }
      return null;
    });

    return (
      <div className={styles.defaultLayout}>
        {withHeader && (
          <header>
            <Popover placement="bottomRight" content={rows} trigger="click">
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.handleToggle}
                style={{ fontSize: '20px' }}
              />
            </Popover>
            <a href="/feed">pickupgames</a>
            {loggedIn ? (
              <img
                src={curUser.avatar}
                alt={curUser.profile.name}
                height="25"
              />
            ) : (/* placeholder */
              <div style={{ height: 25, width: 25 }} />
            )}
          </header>
        )}
        <main style={{ maxWidth: width, padding }}>
          {forceLogin
            ? <ForceLoginContainer children={children} />
            : children
          }
        </main>
        {withFooter && (
          <footer>
            <p>
              pickupgames.net ©2017
              &nbsp;&nbsp;
              <a
                href="https://github.com/fede-rodes/pickupgames"
                target="_blank"
                style={{ color: 'black' }}
              >
                <Icon type="github" style={{ fontSize: '20px' }} />
              </a>
            </p>
          </footer>
        )}
      </div>
    );
  }
}

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  forceLogin: PropTypes.bool.isRequired,
  withHeader: PropTypes.bool.isRequired,
  withFooter: PropTypes.bool.isRequired,
  width: PropTypes.string.isRequired, // '600px', '90%', defaults to '100%'
  padding: PropTypes.string.isRequired, // '0', '30px 15px', defaults to '0'
  reduxState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired, // TODO: change name to loginModalOpen
  }).isRequired,
  reduxActions: PropTypes.object.isRequired,
  meteorData: PropTypes.shape({
    curUser: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired,
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
const DefaultLayoutContainer = createContainer((props) => {
  const {
    children,
    forceLogin = false,
    withHeader = true,
    withFooter = true,
    width = '100%',
    padding = '0',
  } = props;

  const curUser = Meteor.user();

  // All the data about the user is ready at this stage, check layouts/app-container.jsx
  return {
    children,
    forceLogin,
    withHeader,
    withFooter,
    width,
    padding,
    meteorData: {
      curUser,
      loggedIn: !!curUser,
    },
  };
}, connect(mapStateToProps, mapDispatchToProps)(DefaultLayout));

export default DefaultLayoutContainer;
