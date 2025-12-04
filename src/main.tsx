import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './css/font.css';
import './css/rootColors.css';
import './css/common.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import Notification from './common/Notification/Notification';
import { NotificationContextApiProvider } from './Context/Notification/NotificationContextApi';
import ProtectedRoute from './Helper/ProtectedRoute';
import RedirectToDashboard from './Helper/RedirectToDashboard';
import SignIn from './Pages/Auth/SignIn';
import VerifyEmailAddress from './Pages/Auth/VerifyEmailAddress';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationContextApiProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/auth/sign-in' element={<SignIn />} />
          <Route path='/auth/verify-email' element={<VerifyEmailAddress />} />
          <Route path='*' element={<RedirectToDashboard />} />
          <Route
            path='/orbitrms/*'
            element={<ProtectedRoute element={<App />} />}
          />
        </Routes>
      </BrowserRouter>
      <Notification />
    </NotificationContextApiProvider>
  </StrictMode>
);
