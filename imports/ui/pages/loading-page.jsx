import React from 'react';
import DefaultLayoutContainer from '../layouts/default-layout.jsx';
import Spinner from '../components/spinner.jsx';

const LoadingPage = () => (
  <DefaultLayoutContainer withHeader={false} withFooter={false}>
    <Spinner />
  </DefaultLayoutContainer>
);

export default LoadingPage;
