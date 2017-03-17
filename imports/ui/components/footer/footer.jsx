import React from 'react';
import { Icon } from 'antd';
import Constants from '../../../api/constants.js';

const Footer = () => (
  <footer className="flex items-end justify-center px1 py2">
    <p>
      {Constants.SITE_BRAND} ©2017
      <a
        className="inline-block"
        href="https://github.com/fede-rodes/pickupgames"
        target="_blank"
      >
        <Icon type="github" className="h3 ml1 black" />
      </a>
    </p>
  </footer>
);

export default Footer;
