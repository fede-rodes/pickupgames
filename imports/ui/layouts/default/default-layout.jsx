import React, { PropTypes } from 'react';
import HeaderContainer from '../../components/header/header.jsx';
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
          {children}
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
  center: PropTypes.bool.isRequired,
};

DefaultLayout.defaultProps = {
  withHeader: true,
  withFooter: true,
  width: '100%',
  padding: '0',
  center: false,
};

export default DefaultLayout;
