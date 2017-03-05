import React from 'react';
import Constants from '../../../api/constants.js';
import styles from './styles.scss';

const Footer = () => (
  <footer className={`flex items-end justify-center px1 py2 ${styles.Footer}`}>
    <p>{Constants.SITE_BRAND} ©2017</p>
  </footer>
);

export default Footer;
