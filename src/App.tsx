import React from 'react';
import Routing from './Routing';
import { withAuth } from './withAuth';

function App(): JSX.Element {
  return <Routing/>
}

export default withAuth(App);
