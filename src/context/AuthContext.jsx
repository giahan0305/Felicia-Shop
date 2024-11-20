import { createContext, useState} from 'react';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component to manage user authentication and role
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.authorities?.name || null;
  });

  // Function to update user role and save it to localStorage
  const updateUserRole = (role) => {
    setUserRole(role);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    user.authorities = { name: role };
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ userRole, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
