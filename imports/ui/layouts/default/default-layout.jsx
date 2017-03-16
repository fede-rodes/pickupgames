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
    withoutHeader,
    withoutFooter,
    width,
    padding,
    center,
  } = props;

  return (
    <div className={`${styles.DefaultLayout} ${!withoutHeader && 'pthh' || ''}`}>
      {!withoutHeader && <HeaderContainer />}
      <main
        className={`${center && 'flex items-center justify-center' || ''}`}
        style={{ maxWidth: width, padding }}
      >
        <div className={`${center && 'flex-auto' || ''}`}>
          {children}
        </div>
      </main>
      {!withoutFooter && <Footer />}
    </div>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  withoutHeader: PropTypes.bool.isRequired,
  withoutFooter: PropTypes.bool.isRequired,
  width: PropTypes.string.isRequired, // '600px', '90%', defaults to '100%'
  padding: PropTypes.string.isRequired, // '0', '30px 15px', defaults to '0'
  center: PropTypes.bool.isRequired,
};

DefaultLayout.defaultProps = {
  withoutHeader: false,
  withoutFooter: false,
  width: '100%',
  padding: '0',
  center: false,
};

export default DefaultLayout;
