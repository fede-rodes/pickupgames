import React, { Component, PropTypes } from 'react';
import _ from 'underscore';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @example
* <ViewDispatcher
*   {...this.props}
*   breakpoint="768"
*   mobileView={MobileViewCompName}
*   desktopView={DesktopViewCompName}
* />
* @see {@link http://stackoverflow.com/questions/37152789/passing-another-component-to-a-react-component?rq=1}
*/
class ViewDispatcher extends Component {
  // See ES6 Classes section at: https://facebook.github.io/react/docs/reusable-components.html
  constructor(props) {
    super(props);
    this.handleResize = _.throttle(this.handleResize.bind(this), 500);
    this.state = { windowWidth: window.innerWidth };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  render() {
    const { windowWidth } = this.state;
    const { breakpoint, desktopView, mobileView, ...other } = this.props;
    const DesktopView = desktopView;
    const MobileView = mobileView;
    const view = windowWidth < breakpoint ? 'mobile' : 'desktop';
    if (view === 'desktop') {
      return <DesktopView {...other} />;
    }
    return <MobileView {...other} />;
  }
}

ViewDispatcher.propTypes = {
  breakpoint: PropTypes.string.isRequired, // 768, if < 768 display mobile view...
  mobileView: PropTypes.func.isRequired,
  desktopView: PropTypes.func.isRequired,
};

export default ViewDispatcher;
