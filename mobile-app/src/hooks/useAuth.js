import {useAuthContext} from '../store/AuthContext';

const useAuth = () => {
  const {user, token, isLoading, isAuthenticated, login, logout, updateUser} =
    useAuthContext();

  return {user, token, isLoading, isAuthenticated, login, logout, updateUser};
};

export default useAuth;
