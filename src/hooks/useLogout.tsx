import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Clear the user's authentication token from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    // Redirect the user to the login page
    navigate('/login');
  };

  return logout;
};

export default useLogout;

