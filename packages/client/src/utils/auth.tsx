import {
  User,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth } from './firebase';

interface AuthState {
  user?: User;
  loading: boolean;
  error?: string;
  login: (
    email: string,
    password: string,
    callback: CallableFunction,
  ) => Promise<void>;
  logout: (callback: CallableFunction) => Promise<void>;
}

const useProvideAuth = (): AuthState => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(undefined);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (
    email: string,
    password: string,
    callback: CallableFunction,
  ) => {
    setLoading(true);
    setError(undefined);
    const auth = getAuth();
    try {
      setPersistence(auth, browserLocalPersistence);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // these might not be needed because the useEffect may catch it
      setUser(user);
      setLoading(false);

      callback();
    } catch {
      setError('Incorrect email and password');
      setLoading(false);
    }
  };

  const logout = async (callback: CallableFunction) => {
    setLoading(true);
    setError(undefined);
    const auth = getAuth();
    try {
      await signOut(auth);

      // these might not be needed, cause the useEffect may catch it
      setUser(undefined);
      setLoading(false);

      callback();
    } catch {
      setError('Unable to log out');
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};

const AuthContext = createContext<AuthState>({
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
