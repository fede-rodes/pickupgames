import React from 'react';
import DefaultLayout from '../layouts/default/default-layout.jsx';

const NotFoundPage = () => (
  <DefaultLayout width="600px" padding="20px 15px 0" center>
    <h1 className="center">404 - Page Not Found</h1>
    <p className="center">Back to <a href="/feed">Feed</a></p>
  </DefaultLayout>
);

export default NotFoundPage;
