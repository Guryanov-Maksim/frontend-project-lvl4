import { useContext } from 'react';

import { authContext, apiContext } from '../contexts/index.jsx';

const useAuth = () => useContext(authContext);
const useApi = () => useContext(apiContext);

export { useAuth, useApi };
