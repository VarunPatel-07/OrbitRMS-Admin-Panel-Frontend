import { useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import MainSuspenseLoader from './components/loader/MainSuspenseLoader';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import {
  NotificationContext,
  NotificationContextApiProps,
} from './context/notification/NotificationContextApi';
import { useDebounce } from './hooks/useDebounce';
import Dashboard from './pages/Dashboard/Dashboard';
import MaintenanceMode from './pages/MaintenanceMode/MaintenanceModePages/MaintenanceMode';
import MaintenanceModeHistory from './pages/MaintenanceMode/MaintenanceModePages/MaintenanceModeHistory';
import Monitoring from './pages/monitoring/monitoring';
import OrganizationManager from './pages/OrganizationManager/OrganizationManager';
import ViewOrganizationPage from './pages/ViewOrganization/ViewOrganizationPage';
import { verifyUserApiFunction } from './utils/api/api';
import HelmetSeo from './utils/helper/HelmetSeo';
import { getDataFromSecureCookie } from './utils/helper/HelperFunction';
import ProtectedRoute from './utils/helper/ProtectedRoute';

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

                  <Route
                    path='/maintenance-mode/history'
                    element={
                      <ProtectedRoute element={<MaintenanceModeHistory />} />
                    }
                  />
                  <Route
                    path='/monitoring'
                    element={<ProtectedRoute element={<Monitoring />} />}
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
