import { useContext } from 'react';

import { authContext, wsContext } from '../contexts/index.jsx';

const useAuth = () => useContext(authContext);
const useWebsocket = () => useContext(wsContext);

export { useAuth, useWebsocket };
