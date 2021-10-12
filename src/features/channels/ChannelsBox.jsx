import React from 'react';
import { Nav } from 'react-bootstrap';

import Header from './Header.jsx';
import Channels from './Channels.jsx';

const ChannelsBox = () => (
  <>
    <Header />
    <Nav as="ul" className="flex-column px-2">
      <Channels />
    </Nav>
  </>
);

export default ChannelsBox;
