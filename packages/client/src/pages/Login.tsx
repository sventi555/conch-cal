import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
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
    <>
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
        <p className="text-xl">Log in</p>
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
      <Link className="underline" to="/signup">
        Create account
      </Link>
    </>
  );
};
