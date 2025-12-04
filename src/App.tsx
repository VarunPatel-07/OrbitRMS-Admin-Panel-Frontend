import { useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import MainSuspenseLoader from './Components/Loader/MainSuspenseLoader';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Sidebar/Sidebar';
import {
  NotificationContext,
  NotificationContextApiProps,
} from './Context/Notification/NotificationContextApi';
import { verifyUserApiFunction } from './Helper/api/api';
import HelmetSeo from './Helper/HelmetSeo';
import { getDataFromSecureCookie } from './Helper/HelperFunction';
import ProtectedRoute from './Helper/ProtectedRoute';
import { useDebounce } from './Hooks/useDebounce';
import Dashboard from './Pages/Dashboard/Dashboard';
import MaintenanceMode from './Pages/MaintenanceMode/MaintenanceModePages/MaintenanceMode';
import MaintenanceModeHistory from './Pages/MaintenanceMode/MaintenanceModePages/MaintenanceModeHistory';
import OrganizationManager from './Pages/OrganizationManager/OrganizationManager';
import ViewOrganizationPage from './Pages/ViewOrganization/ViewOrganizationPage';

function App() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState<boolean>(true);

  const verifyUsersLoggedIn = useDebounce(async () => {
    const response = await verifyUserApiFunction();

    if (response?.success) {
      setShowGlobalLoader(false);
    } else {
      setShowGlobalLoader(false);
      handelNotification(response, 'top-right');
    }
  }, 100);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    const _cookieToken = getDataFromSecureCookie('adminAuthenticationToken');
    if (_cookieToken) {
      verifyUsersLoggedIn();
    } else {
      setShowGlobalLoader(false);
    }
  }, [verifyUsersLoggedIn]);
  return (
    <>
      <HelmetSeo
        Title='OrbitRMS Admin Panel'
        Content='Streamline your business operations with OrbitRMS. Manage clients, content, resources, and more — all in one powerful platform.'
      />
      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className='w-full h-screen bg-white'>
          <div className='w-full flex flex-col h-full'>
            <Navbar />
            <div className='w-full h-full flex-grow flex justify-stretch'>
              <div className='w-fit'>
                <Sidebar />
              </div>
              <div className='w-[calc(100%-60px)] ml-auto bg-[var(--main-white-color)] overflow-hidden'>
                <Routes>
                  <Route
                    path='/dashboard'
                    element={<ProtectedRoute element={<Dashboard />} />}
                  />
                  <Route
                    path='/organization-manager'
                    element={
                      <ProtectedRoute element={<OrganizationManager />} />
                    }
                  />
                  <Route
                    path='/organizations/:id/*'
                    element={
                      <ProtectedRoute element={<ViewOrganizationPage />} />
                    }
                  />
                  <Route
                    path='/maintenance-mode'
                    element={<ProtectedRoute element={<MaintenanceMode />} />}
                  />
                  \
                  <Route
                    path='/maintenance-mode/history'
                    element={
                      <ProtectedRoute element={<MaintenanceModeHistory />} />
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
