import React from 'react';
import DefaultLayout from '../layouts/default/default-layout.jsx';
import Spinner from '../components/spinner.jsx';

const LoadingPage = () => (
  <DefaultLayout withoutHeader withoutFooter>
    <Spinner />
  </DefaultLayout>
);

export default LoadingPage;
