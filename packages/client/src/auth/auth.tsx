import {
  User,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  // The errors in these functions should actually be derived from
  // the error thrown by firebase. Just guessing now.

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(undefined);
    const auth = getAuth();
    try {
      setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      const error = 'Incorrect email and password';
      setError(error);
      setLoading(false);
      throw new Error(error);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(undefined);
    const auth = getAuth();
    try {
      setPersistence(auth, browserLocalPersistence);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      const error = 'Unable to create user';
      setError(error);
      setLoading(false);
      throw new Error(error);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(undefined);
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch {
      const error = 'Unable to log out';
      setError(error);
      setLoading(false);
      throw new Error(error);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    signup,
  };
};

const AuthContext = createContext<AuthState>({
  loading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
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
