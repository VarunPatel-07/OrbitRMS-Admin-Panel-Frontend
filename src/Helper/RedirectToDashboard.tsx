import { Navigate } from 'react-router-dom';

import {
  clearLocalSessionStorage,
  getDataFromLocalStorage,
  getDataFromSecureCookie,
} from './HelperFunction';

const RedirectToDashboard = () => {
  const _data = getDataFromLocalStorage('organization-info');
  const _cookieToken = getDataFromSecureCookie('adminAuthenticationToken');

  const authToken = `Bearer ${_cookieToken}`;
  const tokenValue = authToken.split('Bearer')[1]?.trim();

  try {
    if (_data && tokenValue) {
      return (
        <Navigate to={`${JSON.parse(_data)?.portal_slug}/dashboard`} replace />
      );
    } else {
      clearLocalSessionStorage();

      return <Navigate to='/auth/sign-in' replace />;
    }
  } catch {
    clearLocalSessionStorage();

    return <Navigate to='/auth/sign-in' replace />;
  }
};

export default RedirectToDashboard;
