import React, { useContext, useEffect, useState } from 'react';
import { MeQuery, useMeQuery } from '../generated/graphql';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface UserType {
  id: number;
  username: string;
}

interface AuthContextProps {
  user: UserType | null;
  fetching: boolean;
}

const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  fetching: true,
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [{ data, fetching }] = useMeQuery();
  const [user, setUser] = useState<AuthContextProps>({
    user: null,
    fetching: true,
  });

  useEffect(() => {
    if (data && data.me) {
      setUser({
        user: {
          id: data.me.id,
          username: data.me.username,
        },
        fetching,
      });
    }
  }, [data]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
