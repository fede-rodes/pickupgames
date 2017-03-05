import React, { PropTypes } from 'react';
import HeaderContainer from '../../components/header/header.jsx';
import ForceLoginContainer from '../../components/force-login/force-login.jsx';
import Footer from '../../components/footer/footer.jsx';
import styles from './styles.scss';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const DefaultLayout = (props) => {
  const {
    children,
    withHeader,
    withFooter,
    width,
    padding,
    forceLogin,
    center,
  } = props;

  return (
    <div className={styles.DefaultLayout}>
      {withHeader && <HeaderContainer />}
      <main
        className={`${center && 'flex items-center justify-center'}`}
        style={{ maxWidth: width, padding }}
      >
        <div className={`${center && 'flex-auto'}`}>
          {forceLogin
            ? <ForceLoginContainer children={children} />
            : children
          }
        </div>
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  withHeader: PropTypes.bool.isRequired,
  withFooter: PropTypes.bool.isRequired,
  width: PropTypes.string.isRequired, // '600px', '90%', defaults to '100%'
  padding: PropTypes.string.isRequired, // '0', '30px 15px', defaults to '0'
  forceLogin: PropTypes.bool.isRequired,
  center: PropTypes.bool.isRequired,
};

DefaultLayout.defaultProps = {
  withHeader: true,
  withFooter: true,
  width: '100%',
  padding: '0',
  forceLogin: false,
  center: false,
};

export default DefaultLayout;
