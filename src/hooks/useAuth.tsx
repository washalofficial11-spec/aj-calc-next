import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (simple mock for now)
    const adminPassword = localStorage.getItem('adminPassword');
    if (adminPassword === 'admin123') {
      setUser({ id: '1', email: 'admin@alnoor.com' });
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const signOut = () => {
    localStorage.removeItem('adminPassword');
    setUser(null);
    setIsAdmin(false);
    navigate('/');
  };

  return {
    user,
    loading,
    isAdmin,
    signOut
  };
};
