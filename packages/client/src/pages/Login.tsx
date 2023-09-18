import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login(email, password)
          .then(() => navigate('/'))
          .catch((err) => {
            // Will want to show the error eventually
            console.log(err);
          });
      }}
    >
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <input type="submit"></input>
    </form>
  );
};
