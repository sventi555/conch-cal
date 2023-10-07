import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

/**
 * TODO for minimum viable app
 * - update and delete calendar events through modal
 */

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
