import React from 'react';
import DefaultLayout from '../layouts/default/default-layout.jsx';
import Spinner from '../components/spinner.jsx';

const LoadingPage = () => (
  <DefaultLayout withHeader={false} withFooter={false}>
    <Spinner />
  </DefaultLayout>
);

export default LoadingPage;
