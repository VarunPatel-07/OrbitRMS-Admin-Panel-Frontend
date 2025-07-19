import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './Helper/ProtectedRoute';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route
          path='/dashboard'
          element={<ProtectedRoute element={<Dashboard />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
