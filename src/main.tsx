import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './css/font.css';
import './css/rootColors.css';

import SignIn from './Pages/Auth/SignIn';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SignIn />
  </StrictMode>
);
