import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { EMPTY_EVENT, EventModalContext } from './components/EventModal';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { EventsProvider } from './state/events';

export const App: React.FC = () => {
  const [modalEvent, setModalEvent] = useState(EMPTY_EVENT);

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <EventsProvider>
            <EventModalContext.Provider
              value={{ event: modalEvent, setEvent: setModalEvent }}
            >
              <Home />
            </EventModalContext.Provider>
          </EventsProvider>
        }
      />
    </Routes>
  );
};
