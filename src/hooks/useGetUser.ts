import { useContext } from 'react';
import { AuthContext } from '../contexts/MeContext';

export function useGetUser() {
  return useContext(AuthContext);
}
