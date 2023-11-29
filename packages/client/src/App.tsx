import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { EventsProvider } from './state/events';
import { EventModalProvider } from './state/modal';

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
