import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, user } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signup(email, password).then(() => navigate('/'));
      }}
    >
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <input type="submit"></input>
    </form>
  );
};
