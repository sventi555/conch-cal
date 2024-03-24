import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { EventsProvider } from './state/Events';
import { EventModalProvider } from './state/Modal';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <EventsProvider>
            <EventModalProvider>
              <Home />
            </EventModalProvider>
          </EventsProvider>
        }
      />
    </Routes>
  );
};
