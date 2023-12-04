import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

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
      <p className="text-xl">Sign up</p>
      <div>
        <label>Email:</label>
        <input
          className="border"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          className="border"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="border" type="submit">
        Submit
      </button>
    </form>
  );
};
